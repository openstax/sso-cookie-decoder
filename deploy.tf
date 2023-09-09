
variable "aws_region" {
  default = "us-east-1"
}
variable "sso_cookie_name" {}
variable "sso_cookie_private_key" {}
variable "sso_cookie_public_key" {}
variable "environment_name" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment_name
      Project     = "Research"
      Application = "All"
    }
  }
}
data "aws_caller_identity" "current" {}


resource "local_file" "cookie_config" {
  content = jsonencode({
    name        = var.sso_cookie_name
    public_key  = var.sso_cookie_public_key
    private_key = var.sso_cookie_private_key
  })
  filename = "./tmp/cookie.json"
}

# resource "null_resource" "build_lambda" {
#   triggers = {
#     always_run = "${timestamp()}"
#   }

#   provisioner "local-exec" {
#     command = "./bin/build"
#   }
# }



resource "aws_cloudfront_function" "sso_cookie_decoder" {
  name    = "sso-cookie-decoder"
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = file("${path.module}/dist/index.js")
}

module "sso_cookie_lambda" {
  source             = "terraform-aws-modules/lambda/aws"
  function_name      = "sso-cookie-decoder"
  publish            = true
  lambda_at_edge     = true
  timeout            = 2
  handler            = "index.handler"
  runtime            = "nodejs18.x"
  attach_policy_json = true
  policy_json = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid      = "ParameterStoreAccess"
        Effect   = "Allow",
        Resource = "arn:aws:ssm:*:${data.aws_caller_identity.current.account_id}:parameter/sso-cookie/${var.environment_name}"
        Action = [
          "ssm:GetParameter",
        ],
      },
    ]
  })
  tags = {
    Name = "SSO Cookie Decoder"
  }
  source_path = [
    {
      path = path.module
      commands = [
        "ENV_NAME=${var.environment_name} ./bin/build",
        ":zip dist/index.js .",
      ]
    }
  ]
}


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

resource "aws_ssm_parameter" "cookie_secrets" {
  name        = "/sso-cookie/${var.environment_name}"
  description = "values for the sso cookie"
  type        = "SecureString"
  value = jsonencode({
    "name"        = var.sso_cookie_name
    "public_key"  = var.sso_cookie_public_key
    "private_key" = var.sso_cookie_private_key
  })
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

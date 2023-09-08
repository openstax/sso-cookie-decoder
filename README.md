# SSO Cookie Decoder

This project contains a Lambda@Edge function that decodes the OpenStax Accounts JWT signed cookie and sets custom HTTP headers based on its content. This is useful for applications behind a CloudFront distribution that wish to make decisions based on JWT claims without having to decode the JWT on every server or application instance.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- AWS Account with permissions to create Lambda functions and CloudFront distributions.
- `node.js` and `npm` installed.
- Nodejs 20+

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/openstax/sso-cookie-decoder.git
    cd sso-cookie-decoder
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Make changes and run tests

    ```bash
    yarn test
    ```

3. Set terraform config vars in your environment

    ```bash
    . ./set-env <staging|production>
    ```
> Note: Make sure you have AWS credentials set using the OpenStax `set_aws_creds` script

4. run terraform
    ```bash
    terraform apply
    ```

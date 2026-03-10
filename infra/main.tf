terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ── Cognito ────────────────────────────────────────────────────────────────────

module "cognito" {
  source = "./modules/cognito"

  project_name  = var.project_name
  environment   = var.environment
  domain_prefix = var.cognito_domain_prefix
  callback_urls = var.cognito_callback_urls
  logout_urls   = var.cognito_logout_urls
}

# ── Frontend (S3 + CloudFront) ─────────────────────────────────────────────────

module "frontend" {
  source = "./modules/frontend"

  project_name = var.project_name
  environment  = var.environment
}


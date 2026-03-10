variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as a prefix for resource names"
  type        = string
  default     = "ai-chat-demo"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}


variable "cognito_domain_prefix" {
  description = "Cognito hosted UI subdomain prefix (e.g. \"ai-chat-demo-dev\")"
  type        = string
  default     = "ai-chat-demo-dev"
}

variable "cognito_callback_urls" {
  description = "Allowed OAuth callback URLs"
  type        = list(string)
  default     = ["http://localhost:5173/callback", "http://localhost:5173/"]
}

variable "cognito_logout_urls" {
  description = "Allowed OAuth logout URLs"
  type        = list(string)
  default     = ["http://localhost:5173/"]
}


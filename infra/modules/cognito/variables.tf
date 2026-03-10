variable "project_name" {
  description = "Project name used as a prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "domain_prefix" {
  description = "Cognito hosted UI subdomain prefix (e.g. \"ai-chat-demo-dev\")"
  type        = string
}

variable "callback_urls" {
  description = "List of allowed OAuth callback URLs"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of allowed OAuth logout URLs"
  type        = list(string)
}

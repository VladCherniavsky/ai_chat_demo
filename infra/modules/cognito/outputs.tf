output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.main.arn
}

output "client_id" {
  description = "Cognito App Client ID (no secret — public SPA)"
  value       = aws_cognito_user_pool_client.app.id
}

output "cognito_domain" {
  description = "Cognito hosted UI domain (set as VITE_COGNITO_DOMAIN in fe/.env.local)"
  value       = "${var.domain_prefix}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

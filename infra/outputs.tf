output "cloudfront_url" {
  description = "CloudFront frontend URL"
  value       = "https://${module.frontend.cloudfront_domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used for cache invalidation after FE deploy"
  value       = module.frontend.cloudfront_distribution_id
}

output "frontend_bucket" {
  description = "S3 bucket name — sync fe/dist here after build"
  value       = module.frontend.bucket_name
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID — set as VITE_COGNITO_USER_POOL_ID in fe/.env.local"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "Cognito App Client ID — set as VITE_COGNITO_CLIENT_ID in fe/.env.local"
  value       = module.cognito.client_id
}

output "cognito_domain" {
  description = "Cognito hosted UI domain — set as VITE_COGNITO_DOMAIN in fe/.env.local"
  value       = module.cognito.cognito_domain
}

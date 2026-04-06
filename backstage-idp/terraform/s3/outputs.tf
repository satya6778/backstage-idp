output "bucket_name" {
  description = "The full name of the created S3 bucket"
  value       = aws_s3_bucket.team_bucket.bucket
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket (used for IAM policies)"
  value       = aws_s3_bucket.team_bucket.arn
}

output "bucket_region" {
  description = "The AWS region where the bucket was created"
  value       = var.aws_region
}

variable "bucket_name" {
  description = "Base name for the S3 bucket. Environment suffix is added automatically."
  type        = string
  # Example: "my-team-storage" → creates "my-team-storage-dev"
}

variable "environment" {
  description = "Deployment environment: dev, staging, or prod"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "aws_region" {
  description = "AWS region to create the bucket in"
  type        = string
  default     = "us-east-1"
}

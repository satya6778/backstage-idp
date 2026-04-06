# ── Provider ──────────────────────────────────────────────────────────────────
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.aws_region
}

# ── S3 Bucket ─────────────────────────────────────────────────────────────────
# This is provisioned when a developer uses the Backstage
# "Provision S3 Bucket" Software Template.

resource "aws_s3_bucket" "team_bucket" {
  bucket = "${var.bucket_name}-${var.environment}"

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedBy   = "Backstage-IDP"
  }
}

# Block all public access by default (security best practice)
resource "aws_s3_bucket_public_access_block" "team_bucket_block" {
  bucket = aws_s3_bucket.team_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning so files can be recovered
resource "aws_s3_bucket_versioning" "team_bucket_versioning" {
  bucket = aws_s3_bucket.team_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

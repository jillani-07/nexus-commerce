variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "nexus-commerce-495109"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west2"
}

variable "backend_image" {
  description = "Backend Docker image URL"
  type        = string
  default     = "europe-west2-docker.pkg.dev/nexus-commerce-495109/nexus-commerce/backend:latest"
}

variable "frontend_image" {
  description = "Frontend Docker image URL"
  type        = string
  default     = "europe-west2-docker.pkg.dev/nexus-commerce-495109/nexus-commerce/frontend:latest"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "nexus_commerce"
}

variable "db_user" {
  description = "Database username"
  type        = string
  default     = "nexus_user"
}
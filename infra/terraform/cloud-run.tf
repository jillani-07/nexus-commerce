# ─── Backend Cloud Run ────────────────────────────────
resource "google_cloud_run_v2_service" "backend" {
  name     = "nexus-backend"
  location = var.region

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      image = var.backend_image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
      }

      env {
        name  = "APP_NAME"
        value = "Nexus Commerce API"
      }
      env {
        name  = "APP_ENV"
        value = "production"
      }
      env {
        name  = "APP_DEBUG"
        value = "false"
      }
      env {
        name  = "DB_CONNECTION"
        value = "pgsql"
      }
      env {
        name  = "DB_HOST"
        value = "/cloudsql/${var.project_id}:${var.region}:nexus-commerce-db"
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_DATABASE"
        value = var.db_name
      }
      env {
        name  = "DB_USERNAME"
        value = var.db_user
      }
      env {
        name  = "CACHE_DRIVER"
        value = "file"
      }
      env {
        name  = "SESSION_DRIVER"
        value = "file"
      }
      env {
        name  = "QUEUE_CONNECTION"
        value = "sync"
      }

      env {
        name = "APP_KEY"
        value_source {
          secret_key_ref {
            secret  = "APP_KEY"
            version = "latest"
          }
        }
      }

      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = "DB_PASSWORD"
            version = "latest"
          }
        }
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = ["${var.project_id}:${var.region}:nexus-commerce-db"]
      }
    }
  }
}

# ─── Frontend Cloud Run ───────────────────────────────
resource "google_cloud_run_v2_service" "frontend" {
  name     = "nexus-frontend"
  location = var.region

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      image = var.frontend_image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = "https://nexus-backend-300651311664.europe-west2.run.app/api/v1"
      }
      env {
        name  = "INTERNAL_API_URL"
        value = "https://nexus-backend-300651311664.europe-west2.run.app/api/v1"
      }
    }
  }
}

# ─── Allow public access ──────────────────────────────
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  name     = google_cloud_run_v2_service.backend.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  name     = google_cloud_run_v2_service.frontend.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
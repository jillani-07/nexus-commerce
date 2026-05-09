resource "google_monitoring_uptime_check_config" "backend" {
  display_name = "nexus-backend-health"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = "/up"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = "nexus-backend-300651311664.europe-west2.run.app"
    }
  }
}

resource "google_monitoring_uptime_check_config" "frontend" {
  display_name = "nexus-frontend-health"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = "/"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = "nexus-frontend-300651311664.europe-west2.run.app"
    }
  }
}
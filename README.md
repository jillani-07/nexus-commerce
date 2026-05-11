# Nexus Commerce

> A cloud-native e-commerce platform built with a full DevOps workflow — containerised services, automated CI/CD, infrastructure as code, and cloud deployment on GCP.

**Live:** https://nexus-frontend-300651311664.europe-west2.run.app

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Laravel](https://img.shields.io/badge/Laravel-11-red?style=flat-square&logo=laravel)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-blue?style=flat-square&logo=docker)
![GCP](https://img.shields.io/badge/GCP-Cloud_Run-4285F4?style=flat-square&logo=google-cloud)
![Terraform](https://img.shields.io/badge/Terraform-IaC-purple?style=flat-square&logo=terraform)
![GitLab CI](https://img.shields.io/badge/GitLab-CI/CD-orange?style=flat-square&logo=gitlab)

---

## Overview

Nexus Commerce is a full-stack e-commerce platform targeting the UK market. Customers can browse products by category, search, add to cart, place orders, and track purchases. The project is built to reflect how modern engineering teams ship software — not just "it works locally" but deployed, monitored, and automated.

**Why this project exists:** To demonstrate end-to-end DevOps ownership — from writing application code to running it reliably in the cloud with zero manual steps after a `git push`.

---
## Architecture

```mermaid
graph TB
    User(["UK User Browser"])

    subgraph GCP ["Google Cloud Platform — europe-west2 (London)"]
        
        subgraph CloudRun ["Cloud Run — Serverless Containers"]
            FE["Frontend Next.js 14 Port 8080"]
            BE["Backend Laravel 11 + PHP 8.4 Nginx + PHP-FPM Port 8080"]
        end

        subgraph Data ["Data Layer"]
            SQL[("Cloud SQL PostgreSQL 15 Private Unix Socket")]
            SM["Secret Manager APP_KEY DB_PASSWORD"]
        end

        subgraph Registry ["Artifact Registry"]
            IMG["Docker Images backend:sha frontend:sha"]
        end

        subgraph Monitoring ["Cloud Monitoring"]
            UP["Uptime Checks Every 5 min"]
            DASH["Dashboard Requests / Errors / Latency"]
        end
    end

    subgraph DevOps ["DevOps — GitLab"]
        GIT["GitLab Repo Source Code"]
        PIPE["CI/CD Pipeline Build to Test to Deploy"]
        TF["Terraform Infrastructure as Code"]
    end

    User -->|HTTPS| FE
    FE -->|REST API calls| BE
    BE -->|Unix Socket| SQL
    BE -->|Fetch secrets at runtime| SM

    GIT -->|git push triggers| PIPE
    PIPE -->|docker push| IMG
    PIPE -->|gcloud run deploy| CloudRun
    IMG -->|pull image| CloudRun

    TF -->|terraform apply| GCP
    UP -->|monitor| FE
    UP -->|monitor| BE
```

## CI/CD Pipeline

```mermaid
flowchart LR
    DEV[Developer MacBook] -->|git push main| GL[GitLab]
    GL --> BUILD

    subgraph PIPELINE [GitLab CICD Pipeline]
        BUILD[BUILD docker buildx] --> TEST
        TEST[TEST PHP TypeScript] --> PUSH
        PUSH[PUSH Artifact Registry] --> DEPLOY
        DEPLOY[DEPLOY Cloud Run]
    end

    DEPLOY -->|live| PROD[Production europe-west2]

    style BUILD fill:#4A90D9,color:#fff
    style TEST fill:#7B68EE,color:#fff
    style PUSH fill:#20B2AA,color:#fff
    style DEPLOY fill:#3CB371,color:#fff
    style PROD fill:#FF6B6B,color:#fff
```
---
## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript | SSR for SEO, fast page loads |
| Backend | Laravel 11, PHP 8.4 | Clean REST API, Eloquent ORM |
| Database | PostgreSQL 15 | UUID support, JSON columns |
| Auth | Laravel Sanctum | Stateless token auth |
| Containers | Docker multi-stage | Small production images |
| Registry | GCP Artifact Registry | Versioned image storage |
| Deployment | GCP Cloud Run | Serverless, auto-scales to zero |
| Database hosting | GCP Cloud SQL | Managed, automated backups |
| Secrets | GCP Secret Manager | Zero credentials in codebase |
| CI/CD | GitLab CI/CD | Automated build → test → deploy |
| IaC | Terraform | Infrastructure reproducible from code |
| Monitoring | GCP Cloud Monitoring | Uptime checks, dashboard |
| State storage | GCP Cloud Storage | Terraform remote state |

---
## Security

```mermaid
graph TB
    subgraph NEVER ["❌ Never in Code"]
        ENV[".env files"]
        PWD["Passwords"]
        KEY["API Keys"]
    end

    subgraph ALWAYS ["✅ Always in Secret Manager"]
        SM["🔐 GCP Secret Manager<br/>Encrypted at rest<br/>IAM controlled<br/>Audit logged"]
    end

    subgraph ACCESS ["Who can access"]
        CR["Cloud Run Service<br/>roles/secretmanager.secretAccessor"]
        CI["CI/CD Service Account<br/>Least privilege only"]
    end

    NEVER -->|"stored here instead"| SM
    SM --> ACCESS

    style NEVER fill:#FFE4E4,color:#CC0000
    style ALWAYS fill:#E4FFE4,color:#006600
    style ACCESS fill:#E4E4FF,color:#000066
```

## Infrastructure

```mermaid
graph LR
    subgraph IaC ["🏗️ Terraform — Infrastructure as Code"]
        TF["main.tf<br/>variables.tf<br/>cloud-run.tf<br/>iam.tf<br/>monitoring.tf"]
    end

    subgraph STATE ["📦 Remote State"]
        GCS["GCS Bucket<br/>nexus-commerce-tfstate<br/>Versioned + Locked"]
    end

    subgraph RESOURCES ["GCP Resources Managed"]
        CR["Cloud Run Services<br/>Frontend + Backend"]
        IAM["IAM Roles<br/>Least Privilege"]
        MON["Uptime Checks<br/>Dashboard"]
        SA["Service Accounts<br/>CI/CD"]
    end

    TF -->|"terraform apply"| RESOURCES
    TF -->|"state stored"| GCS
    GCS -->|"state lock prevents<br/>concurrent runs"| TF
```

## Run Locally

**Prerequisites:** Docker, Docker Compose

```bash
git clone https://github.com/YOUR_USERNAME/nexus-commerce.git
cd nexus-commerce/infra/docker
docker compose up -d
docker exec -it nexus_backend php artisan migrate:fresh --seed
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1

---

## Screenshots

> Homepage — Category browsing, featured products, hero banner

![Homepage](docs/screenshots/homepage.png)

> Products Page — Search, filter by category, sale badges

![Products](docs/screenshots/products.png)

> Product Detail — Image, price, stock status, add to cart

![Product Detail](docs/screenshots/product-detail.png)

> Shopping Cart — Quantity controls, order summary, free shipping threshold

![Cart](docs/screenshots/cart.png)

> GitLab CI/CD Pipeline — Build → Test → Deploy all passing

![Pipeline](docs/screenshots/pipeline.png)


## Author

**Jillani Ansari** — Cloud & DevOps Engineer

[LinkedIn](https://linkedin.com/in/jillani05)

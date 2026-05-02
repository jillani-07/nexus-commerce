#!/bin/bash

PROJECT_ID="nexus-commerce-495109"
REGION="europe-west2"
SQL_CONNECTION="${PROJECT_ID}:${REGION}:nexus-commerce-db"
IMAGE="europe-west2-docker.pkg.dev/${PROJECT_ID}/nexus-commerce/backend:latest"

gcloud run deploy nexus-backend \
  --image=${IMAGE} \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --set-env-vars="APP_NAME=Nexus Commerce API,APP_ENV=production,APP_DEBUG=false,DB_CONNECTION=pgsql,DB_HOST=/cloudsql/${SQL_CONNECTION},DB_PORT=5432,DB_DATABASE=nexus_commerce,DB_USERNAME=nexus_user,CACHE_DRIVER=file,SESSION_DRIVER=file,QUEUE_CONNECTION=sync" \
  --set-secrets="DB_PASSWORD=DB_PASSWORD:latest,APP_KEY=APP_KEY:latest" \
  --add-cloudsql-instances=${SQL_CONNECTION}
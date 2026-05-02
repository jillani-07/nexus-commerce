#!/bin/bash

PROJECT_ID="nexus-commerce-495109"
REGION="europe-west2"
BACKEND_URL="https://nexus-backend-300651311664.europe-west2.run.app"
IMAGE="europe-west2-docker.pkg.dev/${PROJECT_ID}/nexus-commerce/frontend:latest"

gcloud run deploy nexus-frontend \
  --image=${IMAGE} \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL}/api/v1,INTERNAL_API_URL=${BACKEND_URL}/api/v1,NODE_ENV=production"
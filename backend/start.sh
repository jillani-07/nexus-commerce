#!/bin/sh
set -e

echo "Starting Nexus Commerce Backend..."

php artisan config:cache
php artisan route:cache

php-fpm -D

sleep 2

nginx -g "daemon off;"
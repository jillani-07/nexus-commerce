#!/bin/sh
set -e

echo "Starting Nexus Commerce Backend..."

php artisan migrate --force
php artisan config:cache
php artisan route:cache

nginx &
php-fpm

wait
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

cd /var/www/ces-quiz-website

echo "📥 Pulling latest changes..."
git pull

echo "🐳 Stopping containers..."
docker compose down

echo "🔨 Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "📊 Checking container status..."
docker compose ps

echo "📝 Recent logs:"
docker compose logs --tail=50

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://102.211.209.82"


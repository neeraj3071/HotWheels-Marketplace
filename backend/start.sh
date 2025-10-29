#!/bin/bash

# Hot Wheels Marketplace - Quick Start Script

echo "🏎️  Hot Wheels Marketplace Backend - Starting..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if Postgres container is running
if ! docker ps | grep -q "postgres"; then
    echo "🔄 Starting Postgres container..."
    docker compose up -d db
    echo "⏳ Waiting for Postgres to be ready..."
    sleep 5
fi

echo "✅ Postgres is running"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Check if migrations are applied
echo "🔄 Applying database migrations..."
npm run prisma:migrate -- --name init 2>/dev/null || echo "⚠️  Migrations already applied"

echo ""
echo "🚀 Starting development server..."
echo "📍 Server will be available at: http://localhost:4000"
echo "📍 Health check: http://localhost:4000/health"
echo ""
echo "💡 To test the APIs:"
echo "   1. Import Hot_Wheels_Marketplace.postman_collection.json into Postman"
echo "   2. Or see TESTING_GUIDE.md for curl commands"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

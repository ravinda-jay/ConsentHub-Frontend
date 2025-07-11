#!/bin/bash

# Deploy Backend to Render
echo "🚀 Deploying backend to Render..."

# Check if we're in the correct directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found. Are you in the correct directory?"
    exit 1
fi

# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm install

echo "✅ Backend ready for deployment!"
echo "🔗 Make sure to push your changes to the repository connected to Render"
echo "🌐 Your Render service will automatically deploy the changes"

# Show the current CORS configuration
echo ""
echo "🔧 Current CORS configuration allows:"
echo "  - http://localhost:5173 (Vite dev server)"
echo "  - http://localhost:3000 (Local backend)"
echo "  - https://consent-management-system-api.vercel.app (Vercel frontend)"
echo "  - https://consent-management-system-front-end.vercel.app (Alternative Vercel frontend)"
echo ""
echo "🎯 API Endpoints available:"
echo "  - GET /agreements - Get all agreements"
echo "  - GET /agreements/:id - Get specific agreement"
echo "  - POST /agreements - Create new agreement"
echo "  - PATCH /agreements/:id - Update agreement"
echo "  - DELETE /agreements/:id - Delete agreement"
echo "  - GET /health - Health check"
echo ""
echo "✨ Done! Your backend is configured for the new Render URL."

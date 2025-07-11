# Deploy Backend to Render
Write-Host "🚀 Deploying backend to Render..." -ForegroundColor Green

# Check if we're in the correct directory
if (!(Test-Path "backend\server.js")) {
    Write-Host "❌ Error: backend\server.js not found. Are you in the correct directory?" -ForegroundColor Red
    exit 1
}

# Navigate to backend directory
Set-Location backend

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ Backend ready for deployment!" -ForegroundColor Green
Write-Host "🔗 Make sure to push your changes to the repository connected to Render" -ForegroundColor Cyan
Write-Host "🌐 Your Render service will automatically deploy the changes" -ForegroundColor Cyan

# Show the current CORS configuration
Write-Host ""
Write-Host "🔧 Current CORS configuration allows:" -ForegroundColor Magenta
Write-Host "  - http://localhost:5173 (Vite dev server)" -ForegroundColor White
Write-Host "  - http://localhost:3000 (Local backend)" -ForegroundColor White
Write-Host "  - https://consent-management-system-api.vercel.app (Vercel frontend)" -ForegroundColor White
Write-Host "  - https://consent-management-system-front-end.vercel.app (Alternative Vercel frontend)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 API Endpoints available:" -ForegroundColor Magenta
Write-Host "  - GET /agreements - Get all agreements" -ForegroundColor White
Write-Host "  - GET /agreements/:id - Get specific agreement" -ForegroundColor White
Write-Host "  - POST /agreements - Create new agreement" -ForegroundColor White
Write-Host "  - PATCH /agreements/:id - Update agreement" -ForegroundColor White
Write-Host "  - DELETE /agreements/:id - Delete agreement" -ForegroundColor White
Write-Host "  - GET /health - Health check" -ForegroundColor White
Write-Host ""
Write-Host "✨ Done! Your backend is configured for the new Render URL." -ForegroundColor Green

# Go back to project root
Set-Location ..

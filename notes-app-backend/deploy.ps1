# Notes App Deployment Script (PowerShell)
# This script helps deploy both backend and frontend

Write-Host "🚀 Notes App Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "pom.xml")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "📦 Building backend..." -ForegroundColor Yellow
    & .\mvnw.cmd clean package -DskipTests
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend built successfully" -ForegroundColor Green
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Push to GitHub" -ForegroundColor White
        Write-Host "   2. Deploy to Render/Railway/Heroku" -ForegroundColor White
        Write-Host "   3. Get your backend URL" -ForegroundColor White
        Write-Host "   4. Update VITE_API_URL in .env" -ForegroundColor White
    } else {
        Write-Host "❌ Backend build failed" -ForegroundColor Red
        exit 1
    }
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "📦 Building frontend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend built successfully" -ForegroundColor Green
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Push to GitHub" -ForegroundColor White
        Write-Host "   2. Deploy to Vercel" -ForegroundColor White
        Write-Host "   3. Set VITE_API_URL environment variable" -ForegroundColor White
    } else {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        exit 1
    }
}

# Function to test locally
function Test-Local {
    Write-Host "🧪 Testing locally..." -ForegroundColor Yellow
    
    # Check if backend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/notes" -TimeoutSec 5
        Write-Host "✅ Backend is running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend is not running. Please start it with: .\mvnw.cmd spring-boot:run" -ForegroundColor Red
        exit 1
    }
    
    # Check if frontend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend is not running. Please start it with: npm run dev" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Local testing passed" -ForegroundColor Green
}

# Main menu
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1) Deploy Backend" -ForegroundColor White
Write-Host "2) Deploy Frontend" -ForegroundColor White
Write-Host "3) Test Locally" -ForegroundColor White
Write-Host "4) Deploy Both" -ForegroundColor White
Write-Host "5) Exit" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Deploy-Backend
    }
    "2" {
        Deploy-Frontend
    }
    "3" {
        Test-Local
    }
    "4" {
        Deploy-Backend
        Write-Host ""
        Deploy-Frontend
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "📖 For detailed instructions, see DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan

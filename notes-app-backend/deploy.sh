#!/bin/bash

# Notes App Deployment Script
# This script helps deploy both backend and frontend

echo "🚀 Notes App Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "pom.xml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to deploy backend
deploy_backend() {
    echo "📦 Building backend..."
    ./mvnw clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend built successfully"
        echo "📋 Next steps:"
        echo "   1. Push to GitHub"
        echo "   2. Deploy to Render/Railway/Heroku"
        echo "   3. Get your backend URL"
        echo "   4. Update VITE_API_URL in .env"
    else
        echo "❌ Backend build failed"
        exit 1
    fi
}

# Function to deploy frontend
deploy_frontend() {
    echo "📦 Building frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend built successfully"
        echo "📋 Next steps:"
        echo "   1. Push to GitHub"
        echo "   2. Deploy to Vercel"
        echo "   3. Set VITE_API_URL environment variable"
    else
        echo "❌ Frontend build failed"
        exit 1
    fi
}

# Function to test locally
test_local() {
    echo "🧪 Testing locally..."
    
    # Check if backend is running
    if curl -s http://localhost:8080/api/notes > /dev/null; then
        echo "✅ Backend is running"
    else
        echo "❌ Backend is not running. Please start it with: ./mvnw spring-boot:run"
        exit 1
    fi
    
    # Check if frontend is running
    if curl -s http://localhost:5173 > /dev/null; then
        echo "✅ Frontend is running"
    else
        echo "❌ Frontend is not running. Please start it with: npm run dev"
        exit 1
    fi
    
    echo "✅ Local testing passed"
}

# Main menu
echo "What would you like to do?"
echo "1) Deploy Backend"
echo "2) Deploy Frontend"
echo "3) Test Locally"
echo "4) Deploy Both"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        test_local
        ;;
    4)
        deploy_backend
        echo ""
        deploy_frontend
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📖 For detailed instructions, see DEPLOYMENT-GUIDE.md"

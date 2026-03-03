# Docker Hub Push Script
# This script will push your images to Docker Hub

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Docker Hub Image Push Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if images exist
Write-Host "Checking if images are tagged..." -ForegroundColor Yellow
$backendImage = docker images -q codeforlifeee/clootrack-backend:latest
$frontendImage = docker images -q codeforlifeee/clootrack-frontend:latest

if (-not $backendImage) {
    Write-Host "ERROR: Backend image not found!" -ForegroundColor Red
    Write-Host "Run: docker tag project_clootrack-backend:latest codeforlifeee/clootrack-backend:latest" -ForegroundColor Yellow
    exit 1
}

if (-not $frontendImage) {
    Write-Host "ERROR: Frontend image not found!" -ForegroundColor Red
    Write-Host "Run: docker tag project_clootrack-frontend:latest codeforlifeee/clootrack-frontend:latest" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Images found!" -ForegroundColor Green
Write-Host ""

# Push backend
Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push codeforlifeee/clootrack-backend:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend image pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push backend image" -ForegroundColor Red
    Write-Host "Make sure you're logged in: docker login -u codeforlifeee" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Push frontend
Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push codeforlifeee/clootrack-frontend:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend image pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push frontend image" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ All images pushed successfully!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your images are now available at:" -ForegroundColor Yellow
Write-Host "  • https://hub.docker.com/r/codeforlifeee/clootrack-backend" -ForegroundColor Cyan
Write-Host "  • https://hub.docker.com/r/codeforlifeee/clootrack-frontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "Anyone can now pull and run your application with:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.public.yml up -d" -ForegroundColor Green
Write-Host ""

# PowerShell script to start both Backend and Frontend servers
# Usage: .\start-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Food Delivery System - Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Backend node_modules exists
if (-Not (Test-Path "Backend\node_modules")) {
    Write-Host "[1/4] Installing Backend dependencies..." -ForegroundColor Yellow
    Push-Location Backend
    npm install
    Pop-Location
} else {
    Write-Host "[1/4] Backend dependencies OK" -ForegroundColor Green
}

# Check if Client node_modules exists
if (-Not (Test-Path "Web\Client\node_modules")) {
    Write-Host "[2/4] Installing Frontend dependencies..." -ForegroundColor Yellow
    Push-Location Web\Client
    npm install --legacy-peer-deps
    Pop-Location
} else {
    Write-Host "[2/4] Frontend dependencies OK" -ForegroundColor Green
}

Write-Host "[3/4] Starting Backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[4/4] Starting Frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Web\Client; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servers Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor Yellow
Write-Host "  Admin:    admin@fooddelivery.com / Admin@123"
Write-Host "  Owner:    owner1@restaurant.com / Owner@123"
Write-Host "  Customer: customer1@gmail.com / Customer@123"
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

@echo off
REM Script to start both Backend and Frontend servers
REM Usage: start-all.bat

echo ========================================
echo Food Delivery System - Starting...
echo ========================================
echo.

REM Check if Backend node_modules exists
if not exist "Backend\node_modules\" (
    echo [1/4] Installing Backend dependencies...
    cd Backend
    call npm install
    cd ..
) else (
    echo [1/4] Backend dependencies OK
)

REM Check if Client node_modules exists
if not exist "Web\Client\node_modules\" (
    echo [2/4] Installing Frontend dependencies...
    cd Web\Client
    call npm install --legacy-peer-deps
    cd ..\..
) else (
    echo [2/4] Frontend dependencies OK
)

echo [3/4] Starting Backend server...
start "Backend Server" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [4/4] Starting Frontend server...
start "Frontend Server" cmd /k "cd Web\Client && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each terminal to stop
echo ========================================

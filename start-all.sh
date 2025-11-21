#!/bin/bash
# Bash script to start both Backend and Frontend servers
# Usage: ./start-all.sh

echo "========================================"
echo "Food Delivery System - Starting..."
echo "========================================"
echo ""

# Check if Backend node_modules exists
if [ ! -d "Backend/node_modules" ]; then
    echo "[1/4] Installing Backend dependencies..."
    cd Backend
    npm install
    cd ..
else
    echo "[1/4] Backend dependencies OK"
fi

# Check if Client node_modules exists
if [ ! -d "Web/Client/node_modules" ]; then
    echo "[2/4] Installing Frontend dependencies..."
    cd Web/Client
    npm install --legacy-peer-deps
    cd ../..
else
    echo "[2/4] Frontend dependencies OK"
fi

echo "[3/4] Starting Backend server..."
gnome-terminal -- bash -c "cd Backend && npm run dev; exec bash" &

sleep 3

echo "[4/4] Starting Frontend server..."
gnome-terminal -- bash -c "cd Web/Client && npm run dev; exec bash" &

echo ""
echo "========================================"
echo "Servers Starting..."
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Test Accounts:"
echo "  Admin:    admin@fooddelivery.com / Admin@123"
echo "  Owner:    owner1@restaurant.com / Owner@123"
echo "  Customer: customer1@gmail.com / Customer@123"
echo ""
echo "Press Ctrl+C in each terminal to stop"
echo "========================================"

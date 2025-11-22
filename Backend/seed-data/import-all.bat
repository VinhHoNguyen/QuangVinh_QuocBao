@echo off
REM Batch script to import all JSON files into MongoDB and update references
REM Usage: import-all.bat [database_name] [mongodb_uri]

SET DB_NAME=%1
IF "%DB_NAME%"=="" SET DB_NAME=CNPM

SET MONGODB_URI=%2
IF "%MONGODB_URI%"=="" SET MONGODB_URI=mongodb://localhost:27017

echo ========================================
echo MongoDB Data Import Script
echo ========================================
echo Database: %DB_NAME%
echo.

REM Check if mongoimport is available
where mongoimport >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: mongoimport not found in PATH
    echo Please install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools
    pause
    exit /b 1
)

echo Step 1: Importing users...
mongoimport --db %DB_NAME% --collection users --file users.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import users
    pause
    exit /b 1
)

echo Step 2: Importing locations...
mongoimport --db %DB_NAME% --collection locations --file locations.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import locations
    pause
    exit /b 1
)

echo Step 3: Importing restaurants...
mongoimport --db %DB_NAME% --collection restaurants --file restaurants.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import restaurants
    pause
    exit /b 1
)

echo Step 4: Importing products...
mongoimport --db %DB_NAME% --collection products --file products.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import products
    pause
    exit /b 1
)

echo Step 5: Importing drones...
mongoimport --db %DB_NAME% --collection drones --file drones.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import drones
    pause
    exit /b 1
)

echo Step 6: Importing orders...
mongoimport --db %DB_NAME% --collection orders --file orders.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import orders
    pause
    exit /b 1
)

echo Step 7: Importing payments...
mongoimport --db %DB_NAME% --collection payments --file payments.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import payments
    pause
    exit /b 1
)

echo Step 8: Importing deliveries...
mongoimport --db %DB_NAME% --collection deliveries --file deliveries.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import deliveries
    pause
    exit /b 1
)

echo Step 9: Importing carts...
mongoimport --db %DB_NAME% --collection carts --file carts.json --jsonArray --drop
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import carts
    pause
    exit /b 1
)

echo.
echo ========================================
echo All data imported successfully!
echo ========================================
echo.
echo Step 6: Updating ID references...

REM Check if mongosh is available
where mongosh >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: mongosh not found in PATH
    echo Please run update-references.js manually using:
    echo   mongosh %DB_NAME% ^< update-references.js
    pause
    exit /b 0
)

mongosh %DB_NAME% < update-references.js
IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to update references
    echo Please run update-references.js manually
    pause
    exit /b 1
)

echo.
echo ========================================
echo Import Complete!
echo ========================================
echo.
echo Database: %DB_NAME%
echo Collections: users, locations, restaurants, products, drones
echo.
echo Test Accounts:
echo   Admin: admin@fooddelivery.com / Admin@123
echo   Owner: owner1@restaurant.com / Owner@123
echo   Customer: customer1@gmail.com / Customer@123
echo.
pause

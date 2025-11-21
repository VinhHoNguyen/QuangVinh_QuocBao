#!/bin/bash
# Bash script to import all JSON files into MongoDB and update references
# Usage: ./import-all.sh [database_name]

DB_NAME="${1:-food_delivery}"

echo "========================================"
echo "MongoDB Data Import Script"
echo "========================================"
echo "Database: $DB_NAME"
echo ""

# Check if mongoimport is available
if ! command -v mongoimport &> /dev/null; then
    echo "ERROR: mongoimport not found in PATH"
    echo "Please install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

echo "Step 1: Importing users..."
mongoimport --db "$DB_NAME" --collection users --file users.json --jsonArray --drop
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import users"
    exit 1
fi

echo "Step 2: Importing locations..."
mongoimport --db "$DB_NAME" --collection locations --file locations.json --jsonArray --drop
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import locations"
    exit 1
fi

echo "Step 3: Importing restaurants..."
mongoimport --db "$DB_NAME" --collection restaurants --file restaurants.json --jsonArray --drop
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import restaurants"
    exit 1
fi

echo "Step 4: Importing products..."
mongoimport --db "$DB_NAME" --collection products --file products.json --jsonArray --drop
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import products"
    exit 1
fi

echo "Step 5: Importing drones..."
mongoimport --db "$DB_NAME" --collection drones --file drones.json --jsonArray --drop
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import drones"
    exit 1
fi

echo ""
echo "========================================"
echo "All data imported successfully!"
echo "========================================"
echo ""
echo "Step 6: Updating ID references..."

# Check if mongosh is available
if ! command -v mongosh &> /dev/null; then
    echo "WARNING: mongosh not found in PATH"
    echo "Please run update-references.js manually using:"
    echo "  mongosh $DB_NAME < update-references.js"
    exit 0
fi

mongosh "$DB_NAME" < update-references.js
if [ $? -ne 0 ]; then
    echo "WARNING: Failed to update references"
    echo "Please run update-references.js manually"
    exit 1
fi

echo ""
echo "========================================"
echo "Import Complete!"
echo "========================================"
echo ""
echo "Database: $DB_NAME"
echo "Collections: users, locations, restaurants, products, drones"
echo ""
echo "Test Accounts:"
echo "  Admin: admin@fooddelivery.com / Admin@123"
echo "  Owner: owner1@restaurant.com / Owner@123"
echo "  Customer: customer1@gmail.com / Customer@123"
echo ""

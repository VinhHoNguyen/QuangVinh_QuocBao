// Script to automatically update all ID references after importing JSON data
// Run this with: mongosh food_delivery < update-references.js

db = db.getSiblingDB("food_delivery");

print("Starting ID reference updates...\n");

// 1. Get location IDs and create mapping
print("Step 1: Mapping locations...");
const locations = db.locations.find().toArray();
const locationMap = {};
locations.forEach((loc, idx) => {
  locationMap[`LOCATION_ID_${idx + 1}`] = loc._id;
  print(`  Location ${idx + 1}: ${loc.address} -> ${loc._id}`);
});
const droneStationId = db.locations.findOne({type: "drone_station"})._id;
locationMap["DRONE_STATION_ID"] = droneStationId;
print(`  Drone Station: ${droneStationId}`);

// 2. Get owner IDs and create mapping
print("\nStep 2: Mapping restaurant owners...");
const owners = db.users.find({role: "restaurant_owner"}).toArray();
const ownerMap = {};
owners.forEach((owner, idx) => {
  ownerMap[`OWNER_ID_${idx + 1}`] = owner._id;
  print(`  Owner ${idx + 1}: ${owner.email} -> ${owner._id}`);
});

// 3. Update restaurants with correct location and owner IDs
print("\nStep 3: Updating restaurants...");
let restaurantUpdateCount = 0;
db.restaurants.find().forEach(restaurant => {
  const updates = {};
  
  if (typeof restaurant.locationId === 'string' && locationMap[restaurant.locationId]) {
    updates.locationId = locationMap[restaurant.locationId];
  }
  
  if (typeof restaurant.ownerId === 'string' && ownerMap[restaurant.ownerId]) {
    updates.ownerId = ownerMap[restaurant.ownerId];
  }
  
  if (Object.keys(updates).length > 0) {
    db.restaurants.updateOne(
      {_id: restaurant._id},
      {$set: updates}
    );
    restaurantUpdateCount++;
    print(`  Updated restaurant: ${restaurant.name}`);
  }
});
print(`  Total restaurants updated: ${restaurantUpdateCount}`);

// 4. Get restaurant IDs and create mapping
print("\nStep 4: Mapping restaurants...");
const restaurants = db.restaurants.find().toArray();
const restaurantMap = {};
restaurants.forEach((rest, idx) => {
  restaurantMap[`RESTAURANT_ID_${idx + 1}`] = rest._id;
  print(`  Restaurant ${idx + 1}: ${rest.name} -> ${rest._id}`);
});

// 5. Update products with correct restaurant IDs
print("\nStep 5: Updating products...");
let productUpdateCount = 0;
db.products.find().forEach(product => {
  if (typeof product.restaurantId === 'string' && restaurantMap[product.restaurantId]) {
    db.products.updateOne(
      {_id: product._id},
      {$set: {restaurantId: restaurantMap[product.restaurantId]}}
    );
    productUpdateCount++;
    print(`  Updated product: ${product.name}`);
  }
});
print(`  Total products updated: ${productUpdateCount}`);

// 6. Update drones with correct location ID
print("\nStep 6: Updating drones...");
const droneUpdateResult = db.drones.updateMany(
  {currentLocationId: "DRONE_STATION_ID"},
  {$set: {currentLocationId: droneStationId}}
);
print(`  Total drones updated: ${droneUpdateResult.modifiedCount}`);

// 7. Verify the updates
print("\n=== Verification ===");
print(`Total users: ${db.users.countDocuments()}`);
print(`Total locations: ${db.locations.countDocuments()}`);
print(`Total restaurants: ${db.restaurants.countDocuments()}`);
print(`Total products: ${db.products.countDocuments()}`);
print(`Total drones: ${db.drones.countDocuments()}`);

// Check for any remaining string IDs that should be ObjectIds
print("\n=== Checking for unresolved references ===");
const restaurantsWithStringIds = db.restaurants.find({
  $or: [
    {locationId: {$type: "string"}},
    {ownerId: {$type: "string"}}
  ]
}).count();
print(`Restaurants with string IDs: ${restaurantsWithStringIds}`);

const productsWithStringIds = db.products.find({
  restaurantId: {$type: "string"}
}).count();
print(`Products with string IDs: ${productsWithStringIds}`);

const dronesWithStringIds = db.drones.find({
  currentLocationId: {$type: "string"}
}).count();
print(`Drones with string IDs: ${dronesWithStringIds}`);

print("\n✅ All ID references updated successfully!");
print("You can now use the API endpoints to interact with the data.");

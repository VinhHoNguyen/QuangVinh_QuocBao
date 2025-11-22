const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restaurant_owner', 'customer'], default: 'customer' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LocationSchema = new mongoose.Schema({
  type: { type: String, enum: ['restaurant', 'drone_station'], required: true },
  coords: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  address: { type: String, required: true }
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  imagePublicId: { type: String },
  minOrder: { type: Number, default: 0 },
  maxOrder: { type: Number, default: 10000000 },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  imagePublicId: { type: String },
  category: { type: String, enum: ['main_course', 'appetizer', 'drink', 'dessert', 'side_dish'], required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DroneSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  battery: { type: Number, default: 100 },
  currentLoad: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'busy', 'maintenance', 'charging'], default: 'available' },
  currentLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Location = mongoose.model('Location', LocationSchema);
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Product = mongoose.model('Product', ProductSchema);
const Drone = mongoose.model('Drone', DroneSchema);

// MongoDB Atlas connection - Database: CNPM
const MONGODB_URI = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB Atlas - Database: CNPM');
  console.log('🌱 Starting seed process...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Location.deleteMany({});
    await Restaurant.deleteMany({});
    await Product.deleteMany({});
    await Drone.deleteMany({});

    // Load seed data from JSON files
    const seedDataPath = path.join(__dirname, '../../seed-data');
    const usersData = JSON.parse(fs.readFileSync(path.join(seedDataPath, 'users.json'), 'utf8'));
    const locationsData = JSON.parse(fs.readFileSync(path.join(seedDataPath, 'locations.json'), 'utf8'));
    const restaurantsData = JSON.parse(fs.readFileSync(path.join(seedDataPath, 'restaurants.json'), 'utf8'));
    const productsData = JSON.parse(fs.readFileSync(path.join(seedDataPath, 'products.json'), 'utf8'));
    const dronesData = JSON.parse(fs.readFileSync(path.join(seedDataPath, 'drones.json'), 'utf8'));

    // Insert users
    console.log('👤 Inserting users...');
    const users = await User.insertMany(usersData);
    console.log(`   ✓ Created ${users.length} users`);

    // Insert locations
    console.log('📍 Inserting locations...');
    const locations = await Location.insertMany(locationsData);
    console.log(`   ✓ Created ${locations.length} locations`);

    // Map owners by email for restaurants
    const ownerMap = {};
    users.forEach(user => {
      if (user.role === 'restaurant_owner') {
        ownerMap[user.email] = user._id;
      }
    });

    // Insert restaurants with locationId and ownerId references
    console.log('🏪 Inserting restaurants...');
    const restaurantsWithRefs = restaurantsData.map((restaurant, index) => ({
      ...restaurant,
      locationId: locations[index]._id,
      ownerId: ownerMap['owner1@restaurant.com'] || users[1]._id
    }));
    const restaurants = await Restaurant.insertMany(restaurantsWithRefs);
    console.log(`   ✓ Created ${restaurants.length} restaurants`);

    // Insert products with restaurantId references
    console.log('🍜 Inserting products...');
    const productsWithRefs = productsData.map((product, index) => {
      const restaurantIndex = Math.floor(index / 3); // 3 products per restaurant
      return {
        ...product,
        restaurantId: restaurants[restaurantIndex]._id
      };
    });
    const products = await Product.insertMany(productsWithRefs);
    console.log(`   ✓ Created ${products.length} products`);

    // Insert drones with currentLocationId reference (drone station)
    console.log('🚁 Inserting drones...');
    const droneStation = locations.find(loc => loc.type === 'drone_station');
    const dronesWithRefs = dronesData.map(drone => ({
      ...drone,
      currentLocationId: droneStation._id
    }));
    const drones = await Drone.insertMany(dronesWithRefs);
    console.log(`   ✓ Created ${drones.length} drones`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Locations: ${locations.length}`);
    console.log(`   - Restaurants: ${restaurants.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Drones: ${drones.length}`);
    console.log('\n🎉 Database ready to use!');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connection closed');
  }
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

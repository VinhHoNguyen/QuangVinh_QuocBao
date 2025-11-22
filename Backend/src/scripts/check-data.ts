import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import Location from '../models/Location';

const MONGODB_URI = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';

async function checkData() {
  try {
    // Connect
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check collections exist
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('📦 Collections in database:');
    collections.forEach(c => console.log(`   - ${c.name}`));
    console.log('');

    // Count documents
    console.log('📊 Document counts:');
    const restaurantCount = await Restaurant.countDocuments();
    const userCount = await User.countDocuments();
    const locationCount = await Location.countDocuments();
    console.log(`   - restaurants: ${restaurantCount}`);
    console.log(`   - users: ${userCount}`);
    console.log(`   - locations: ${locationCount}`);
    console.log('');

    // Get all restaurants (without populate)
    console.log('🏪 Fetching restaurants (without populate)...');
    const restaurants = await Restaurant.find();
    console.log(`   - Found: ${restaurants.length}`);
    if (restaurants.length > 0) {
      console.log('\n📝 First restaurant:');
      console.log(JSON.stringify(restaurants[0], null, 2));
    }
    console.log('');

    // Try with populate
    console.log('🏪 Fetching restaurants (with populate)...');
    try {
      const restaurantsWithPopulate = await Restaurant.find()
        .populate('ownerId', 'name email')
        .populate('locationId');
      console.log(`   - Found: ${restaurantsWithPopulate.length}`);
      if (restaurantsWithPopulate.length > 0) {
        console.log('\n📝 First restaurant with populate:');
        console.log(JSON.stringify(restaurantsWithPopulate[0], null, 2));
      }
    } catch (error: any) {
      console.error('❌ Populate error:', error.message);
    }

  } catch (error: any) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

checkData();

import mongoose from 'mongoose';
import User from '../models/User';
import Restaurant from '../models/Restaurant';

async function checkMapping() {
  try {
    await mongoose.connect('mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({ role: 'restaurant_owner' });
    
    console.log(`👥 Total restaurant owners: ${users.length}\n`);

    for (const user of users) {
      console.log('='.repeat(60));
      console.log(`📧 Email: ${user.email}`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   Password: ${user.password ? '✅ Set' : '❌ None'}`);
      console.log(`   RestaurantId in User: ${user.restaurantId || '❌ None'}`);
      
      // Find restaurant owned by this user
      const restaurant = await Restaurant.findOne({ ownerId: user._id });
      if (restaurant) {
        console.log(`   ✅ Owns Restaurant: ${restaurant.name}`);
        console.log(`      Restaurant ID: ${restaurant._id}`);
        
        // Check if user.restaurantId matches
        if (user.restaurantId && user.restaurantId.toString() === restaurant._id.toString()) {
          console.log(`      ✅ restaurantId in User matches!`);
        } else {
          console.log(`      ⚠️  restaurantId mismatch!`);
          console.log(`         User.restaurantId: ${user.restaurantId}`);
          console.log(`         Restaurant._id: ${restaurant._id}`);
        }
      } else {
        console.log(`   ❌ No restaurant found for this owner`);
      }
      console.log();
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMapping();

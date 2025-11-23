import mongoose from 'mongoose';
import User from '../models/User';
import Restaurant from '../models/Restaurant';

async function fixRestaurantIds() {
  try {
    await mongoose.connect('mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB\n');

    // Get all restaurants
    const restaurants = await Restaurant.find({});
    console.log(`🏪 Found ${restaurants.length} restaurants\n`);

    let fixedCount = 0;
    let errorCount = 0;
    const processedUsers = new Set<string>();

    for (const restaurant of restaurants) {
      try {
        // Find the user who owns this restaurant
        const user = await User.findById(restaurant.ownerId);
        
        if (!user) {
          console.log(`❌ No user found for restaurant: ${restaurant.name} (owner ID: ${restaurant.ownerId})`);
          errorCount++;
          continue;
        }

        // Skip if we already processed this user
        const userIdStr = user._id.toString();
        if (processedUsers.has(userIdStr)) {
          console.log(`⏭️  SKIPPED: ${restaurant.name} (user ${user.email} already processed)\n`);
          continue;
        }

        // Check if restaurantId needs fixing
        if (user.restaurantId && user.restaurantId.toString() === restaurant._id.toString()) {
          console.log(`✅ Already correct: ${restaurant.name}`);
          console.log(`   User: ${user.email}`);
          console.log(`   RestaurantId matches: ${restaurant._id}\n`);
        } else {
          // Fix the restaurantId - use FIRST restaurant owned by this user
          await User.findByIdAndUpdate(user._id, {
            restaurantId: restaurant._id
          });
          
          console.log(`🔧 FIXED: ${restaurant.name}`);
          console.log(`   User: ${user.email}`);
          console.log(`   Old RestaurantId: ${user.restaurantId}`);
          console.log(`   New RestaurantId: ${restaurant._id}\n`);
          
          fixedCount++;
        }

        processedUsers.add(userIdStr);
      } catch (error) {
        console.log(`❌ Error processing restaurant ${restaurant.name}:`, error);
        errorCount++;
      }
    }

    console.log('='.repeat(60));
    console.log(`✅ Fixed ${fixedCount} user restaurantIds`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(60));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixRestaurantIds();

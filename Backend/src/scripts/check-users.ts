import mongoose from 'mongoose';
import '../models/User';
import '../models/Restaurant';

const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');

const checkUsers = async () => {
  try {
    const mongoUri = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Kiểm tra users có role restaurant_owner
    const restaurantOwners = await User.find({ role: 'restaurant_owner' });
    
    console.log(`📊 Found ${restaurantOwners.length} restaurant owners\n`);
    
    for (const user of restaurantOwners) {
      console.log('==================================================');
      console.log(`👤 User: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📞 Phone: ${user.phone}`);
      console.log(`   🔑 Password (hashed): ${user.password ? user.password.substring(0, 30) + '...' : 'NO PASSWORD!'}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log(`   ✅ Status: ${user.status}`);
      
      if (user.restaurantId) {
        const restaurant = await Restaurant.findById(user.restaurantId);
        if (restaurant) {
          console.log(`   🏪 Restaurant: ${restaurant.name}`);
        }
      }
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkUsers();

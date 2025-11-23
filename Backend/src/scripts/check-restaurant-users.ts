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

    // Lấy tất cả user có role restaurant_owner
    const users = await User.find({ role: 'restaurant_owner' });
    
    console.log(`📊 Found ${users.length} restaurant owner users:\n`);

    for (const user of users) {
      const restaurant = await Restaurant.findById(user.restaurantId);
      console.log('='.repeat(60));
      console.log(`👤 User ID: ${user._id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👨 Name: ${user.name}`);
      console.log(`📞 Phone: ${user.phone}`);
      console.log(`🔐 Password Hash: ${user.password ? 'EXISTS ✅' : 'MISSING ❌'}`);
      console.log(`🏷️  Role: ${user.role}`);
      console.log(`🏪 Restaurant: ${restaurant ? restaurant.name : 'N/A'}`);
      console.log(`🏪 Restaurant ID: ${user.restaurantId || 'N/A'}`);
      console.log('');
    }

    console.log('✅ Disconnected from MongoDB');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkUsers();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../models/User';
import '../models/Restaurant';

const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');

const updateAllPasswords = async () => {
  try {
    const mongoUri = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Mật khẩu chung cho tất cả
    const commonPassword = 'restaurant123';
    const hashedPassword = await bcrypt.hash(commonPassword, 10);

    // Lấy tất cả restaurant owners
    const users = await User.find({ role: 'restaurant_owner' });
    
    console.log(`📊 Updating password for ${users.length} restaurant owners...\n`);

    for (const user of users) {
      user.password = hashedPassword;
      await user.save();

      const restaurant = await Restaurant.findById(user.restaurantId);
      
      console.log('✅ Updated password for:');
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏪 Restaurant: ${restaurant ? restaurant.name : 'N/A'}`);
      console.log(`   🔑 Password: ${commonPassword}\n`);
    }

    console.log('='.repeat(60));
    console.log('✅ All passwords updated successfully!\n');
    console.log('📋 Login credentials:');
    console.log(`   Password for ALL restaurants: ${commonPassword}\n`);
    
    console.log('📧 Email list:');
    for (const user of users) {
      const restaurant = await Restaurant.findById(user.restaurantId);
      console.log(`   - ${user.email} (${restaurant ? restaurant.name : 'N/A'})`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateAllPasswords();

import mongoose from 'mongoose';
import User from '../models/User';

const MONGO_URI = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM';

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find().select('email name role phone');
    
    console.log('\n📋 Users in database:');
    console.log('Total:', users.length);
    console.log('\nList:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} (${user.role}) - ${user.phone || 'No phone'}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listUsers();

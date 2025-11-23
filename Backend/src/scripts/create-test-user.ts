import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const MONGO_URI = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM';

async function createTestUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const testEmail = 'test@gmail.com';
    const testPassword = '123456';

    // Check if user exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('⚠️  User already exists, updating password...');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log('✅ Password updated');
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await User.create({
        email: testEmail,
        name: 'Test User',
        password: hashedPassword,
        phone: '0123456789',
        role: 'customer',
        status: 'active'
      });
      console.log('✅ Test user created');
    }

    console.log('\n📝 Test Credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUser();

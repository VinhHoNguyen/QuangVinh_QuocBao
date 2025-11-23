import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import User model
import '../models/User';
const User = mongoose.model('User');

const resetAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://caonguyenduy1612:DuyNguyen1612@cnpm.f0hqo.mongodb.net/CNPM?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    const deleteResult = await User.deleteOne({ email: 'admin@fastfood.com' });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} admin user(s)`);

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create new admin user
    const adminUser = new User({
      email: 'admin@fastfood.com',
      password: hashedPassword,
      name: 'Admin System',
      phone: '0900000000',
      role: 'admin',
      address: {
        street: 'Admin Office',
        district: 'Central',
        city: 'Ho Chi Minh',
        coordinates: {
          latitude: 10.762622,
          longitude: 106.660172
        }
      }
    });

    await adminUser.save();

    console.log('✅ Admin user reset successfully!');
    console.log('Email: admin@fastfood.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\n🔐 Try logging in now!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error resetting admin user:', error);
    process.exit(1);
  }
};

resetAdminUser();

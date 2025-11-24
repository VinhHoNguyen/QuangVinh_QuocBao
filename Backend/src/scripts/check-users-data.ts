import mongoose from 'mongoose';
import User from '../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!\n');

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Tổng số users: ${totalUsers}\n`);

    // Get users by role
    const adminCount = await User.countDocuments({ role: 'admin' });
    const customerCount = await User.countDocuments({ role: 'customer' });
    const restaurantOwnerCount = await User.countDocuments({ role: 'restaurant_owner' });
    const deliveryCount = await User.countDocuments({ role: 'delivery' });

    console.log('📈 Phân loại theo vai trò:');
    console.log(`   - Admin: ${adminCount}`);
    console.log(`   - Khách hàng: ${customerCount}`);
    console.log(`   - Nhà hàng: ${restaurantOwnerCount}`);
    console.log(`   - Giao hàng: ${deliveryCount}\n`);

    // Get users by status
    const activeCount = await User.countDocuments({ status: 'active' });
    const suspendedCount = await User.countDocuments({ status: 'suspended' });
    const inactiveCount = await User.countDocuments({ status: 'inactive' });

    console.log('📊 Phân loại theo trạng thái:');
    console.log(`   - Hoạt động: ${activeCount}`);
    console.log(`   - Tạm khóa: ${suspendedCount}`);
    console.log(`   - Không hoạt động: ${inactiveCount}\n`);

    // Get sample users
    const sampleUsers = await User.find().limit(5).select('name email role status createdAt');
    console.log('👥 Danh sách mẫu (5 users đầu tiên):');
    sampleUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Vai trò: ${user.role} | Trạng thái: ${user.status}`);
      console.log(`      Ngày tạo: ${user.createdAt.toLocaleDateString('vi-VN')}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Đã đóng kết nối database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkUsers();

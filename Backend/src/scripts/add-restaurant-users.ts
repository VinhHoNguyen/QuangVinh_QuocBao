import mongoose from 'mongoose';
import dotenv from 'dotenv';
const bcrypt = require('bcrypt');
import User, { UserRole } from '../models/User';
import Restaurant from '../models/Restaurant';

dotenv.config();

// Restaurant email mapping based on restaurant name
const restaurantEmailMap: { [key: string]: string } = {
  'Phở Hà Nội': 'pho.hanoi@restaurant.vn',
  'Cơm Tấm Sài Gòn': 'comtam.saigon@restaurant.vn',
  'Bánh Mì 362': 'banhmi362@restaurant.vn',
  'Lẩu Thái Tomyum': 'lauthai.tomyum@restaurant.vn',
  'Gà Rán KFC': 'kfc@restaurant.vn',
  'Sushi Tokyo': 'sushi.tokyo@restaurant.vn',
};

const addRestaurantUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/CNPM';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get all restaurants sorted by name
    const restaurants = await Restaurant.find().sort({ name: 1 });
    console.log(`\nFound ${restaurants.length} restaurants in database:`);
    restaurants.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.name} - ${r.address}`);
    });

    if (restaurants.length === 0) {
      console.log('\n❌ No restaurants found. Please run seed script first:');
      console.log('   npx ts-node src/scripts/seed-all.ts');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash('restaurant123', 10);

    // Create restaurant users
    const restaurantUsers = [];
    let created = 0;
    let updated = 0;

    console.log('\n📝 Creating/Updating restaurant users...\n');

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      
      // Get email from map or generate default
      const email = restaurantEmailMap[restaurant.name] || `restaurant${i + 1}@example.com`;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        // Update existing user with restaurantId
        existingUser.restaurantId = restaurant._id as any;
        existingUser.role = UserRole.RESTAURANT_OWNER;
        existingUser.name = `Quản lý ${restaurant.name}`;
        await existingUser.save();
        console.log(`✓ Updated user for: ${restaurant.name}`);
        restaurantUsers.push(existingUser);
        updated++;
      } else {
        // Create new user
        const newUser = await User.create({
          email,
          password: hashedPassword,
          name: `Quản lý ${restaurant.name}`,
          phone: restaurant.phone || `090${1000000 + i}`,
          role: UserRole.RESTAURANT_OWNER,
          restaurantId: restaurant._id as any,
        });
        console.log(`✓ Created user for: ${restaurant.name}`);
        restaurantUsers.push(newUser);
        created++;
      }
    }

    console.log(`\n✅ Done! Created ${created} users, Updated ${updated} users`);
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📋 LOGIN CREDENTIALS FOR RESTAURANT ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    restaurantUsers.forEach((user, idx) => {
      const restaurant = restaurants.find(r => r._id.toString() === user.restaurantId?.toString());
      console.log(`${idx + 1}. ${restaurant?.name || 'Unknown Restaurant'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: restaurant123`);
      console.log(`   🏪 Restaurant ID: ${user.restaurantId}`);
      console.log(`   📱 Phone: ${user.phone}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 HOW TO USE:');
    console.log('1. Start backend: cd Backend && npm run dev');
    console.log('2. Start Restaurant app: cd Web/Restaurant && npm run dev');
    console.log('3. Login with any email above + password: restaurant123');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addRestaurantUsers();

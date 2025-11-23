import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../models/User';
import '../models/Restaurant';
import '../models/Location';

const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');

// Danh sách 6 email vừa tạo để xóa
const emailsToDelete = [
  'phohanoi@restaurant.com',
  'bunchaobama@restaurant.com',
  'banhmihoian@restaurant.com',
  'kfcexpress@restaurant.com',
  'lauthai@restaurant.com',
  'comtamsaigon@restaurant.com'
];

// Thông tin để cập nhật cho 6 nhà hàng đã có
const restaurantUpdates = [
  {
    name: 'Phở Hà Nội 24h',
    email: 'phohanoi24h@restaurant.com',
    password: 'restaurant123',
    phone: '0901234567',
    ownerName: 'Nguyễn Văn Phở'
  },
  {
    name: 'Bún Chả Obama',
    email: 'bunchaobama@restaurant.com',
    password: 'restaurant123',
    phone: '0901234568',
    ownerName: 'Trần Thị Bún'
  },
  {
    name: 'Bánh Mì Hội An',
    email: 'banhmihoian@restaurant.com',
    password: 'restaurant123',
    phone: '0901234569',
    ownerName: 'Lê Văn Bánh'
  },
  {
    name: 'Gà Rán KFC Express',
    email: 'kfcexpress@restaurant.com',
    password: 'restaurant123',
    phone: '0901234570',
    ownerName: 'Phạm Thị Gà'
  },
  {
    name: 'Lẩu Thái Tomyum',
    email: 'lauthai@restaurant.com',
    password: 'restaurant123',
    phone: '0901234571',
    ownerName: 'Hoàng Văn Lẩu'
  },
  {
    name: 'Cơm Tấm Sài Gòn',
    email: 'comtamsaigon@restaurant.com',
    password: 'restaurant123',
    phone: '0901234572',
    ownerName: 'Vũ Thị Cơm'
  }
];

const updateRestaurants = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // 1. Xóa 6 nhà hàng vừa tạo
    console.log('🗑️  Deleting newly created restaurants...\n');
    
    for (const email of emailsToDelete) {
      const user = await User.findOne({ email });
      if (user) {
        // Xóa Restaurant
        if (user.restaurantId) {
          const restaurant = await Restaurant.findById(user.restaurantId);
          if (restaurant) {
            // Xóa Location
            if (restaurant.locationId) {
              await Location.findByIdAndDelete(restaurant.locationId);
              console.log(`   ✅ Deleted Location for ${email}`);
            }
            await Restaurant.findByIdAndDelete(restaurant._id);
            console.log(`   ✅ Deleted Restaurant: ${restaurant.name}`);
          }
        }
        // Xóa User
        await User.findByIdAndDelete(user._id);
        console.log(`   ✅ Deleted User: ${email}\n`);
      }
    }

    console.log('✅ Deletion complete!\n');
    console.log('=======================================================\n');

    // 2. Lấy 6 nhà hàng đã có sẵn
    console.log('🔍 Finding existing restaurants...\n');
    const existingRestaurants = await Restaurant.find().limit(6);
    
    if (existingRestaurants.length === 0) {
      console.log('❌ No existing restaurants found!');
      await mongoose.disconnect();
      return;
    }

    console.log(`✅ Found ${existingRestaurants.length} existing restaurants\n`);
    console.log('=======================================================\n');

    // 3. Cập nhật thông tin cho mỗi nhà hàng
    console.log('📝 Updating restaurant information...\n');
    
    const updatedRestaurants = [];

    for (let i = 0; i < Math.min(existingRestaurants.length, restaurantUpdates.length); i++) {
      const restaurant = existingRestaurants[i];
      const updateInfo = restaurantUpdates[i];

      // Hash password
      const hashedPassword = await bcrypt.hash(updateInfo.password, 10);

      // Tạo hoặc cập nhật Location
      let location = await Location.findById(restaurant.locationId);
      if (!location) {
        // Tạo location mới nếu chưa có
        const coords = {
          latitude: 21.0285 + (i * 0.01),
          longitude: 105.8542 + (i * 0.01)
        };
        location = await Location.create({
          type: 'restaurant',
          coords: coords,
          address: restaurant.address || `Address for ${updateInfo.name}`
        });
        
        // Cập nhật locationId cho restaurant
        restaurant.locationId = location._id;
      }

      // Tạo hoặc cập nhật User (owner)
      let user = await User.findById(restaurant.ownerId);
      
      if (!user) {
        // Tạo user mới
        user = await User.create({
          email: updateInfo.email,
          password: hashedPassword,
          name: updateInfo.ownerName,
          phone: updateInfo.phone,
          role: 'restaurant_owner',
          status: 'active',
          restaurantId: restaurant._id
        });

        // Cập nhật ownerId cho restaurant
        restaurant.ownerId = user._id;
      } else {
        // Cập nhật user hiện có
        user.email = updateInfo.email;
        user.password = hashedPassword;
        user.name = updateInfo.ownerName;
        user.phone = updateInfo.phone;
        user.role = 'restaurant_owner';
        user.status = 'active';
        user.restaurantId = restaurant._id;
        await user.save();
      }

      // Cập nhật thông tin restaurant
      restaurant.phone = updateInfo.phone;
      await restaurant.save();

      console.log(`✅ Updated: ${restaurant.name}`);
      console.log(`   📧 Email: ${updateInfo.email}`);
      console.log(`   🔑 Password: ${updateInfo.password}`);
      console.log(`   👤 Owner: ${updateInfo.ownerName}`);
      console.log(`   📞 Phone: ${updateInfo.phone}`);
      console.log(`   🏪 Restaurant ID: ${restaurant._id}`);
      console.log(`   👤 User ID: ${user._id}`);
      console.log(`   📍 Location ID: ${location._id}\n`);

      updatedRestaurants.push({
        restaurant: restaurant.name,
        email: updateInfo.email,
        password: updateInfo.password,
        owner: updateInfo.ownerName,
        phone: updateInfo.phone,
        restaurantId: restaurant._id,
        userId: user._id,
        locationId: location._id
      });
    }

    console.log('=======================================================\n');
    console.log('✅ Successfully updated restaurant information!\n');
    console.log('=======================================================\n');
    console.log('📋 Login credentials for all restaurants:\n');
    console.log('Password for all: restaurant123\n');

    updatedRestaurants.forEach((r, index) => {
      console.log(`${index + 1}. ${r.restaurant}`);
      console.log(`   Email: ${r.email}`);
      console.log(`   Owner: ${r.owner}`);
      console.log(`   Phone: ${r.phone}`);
    });

    console.log('\n✅ Disconnected from MongoDB');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error updating restaurants:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateRestaurants();

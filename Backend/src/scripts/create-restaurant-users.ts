import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import '../models/User';
import '../models/Restaurant';
import '../models/Location';

const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');

const restaurantData = [
  {
    name: 'Phở Hà Nội 24h',
    email: 'phohanoi@restaurant.com',
    password: 'restaurant123',
    phone: '0901234567',
    ownerName: 'Nguyễn Văn Phở',
    address: {
      street: '123 Phố Huế',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0285, longitude: 105.8542 }
    },
    restaurantInfo: {
      cuisineType: 'Việt Nam',
      minOrder: 50000,
      maxOrder: 500000,
      rating: 4.8
    }
  },
  {
    name: 'Bún Chả Obama',
    email: 'bunchaobama@restaurant.com',
    password: 'restaurant123',
    phone: '0901234568',
    ownerName: 'Trần Thị Bún',
    address: {
      street: '1 Lê Văn Hưu',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0167, longitude: 105.8500 }
    },
    restaurantInfo: {
      cuisineType: 'Việt Nam',
      minOrder: 40000,
      maxOrder: 400000,
      rating: 4.9
    }
  },
  {
    name: 'Bánh Mì Hội An',
    email: 'banhmihoian@restaurant.com',
    password: 'restaurant123',
    phone: '0901234569',
    ownerName: 'Lê Văn Bánh',
    address: {
      street: '25 Hàng Bè',
      district: 'Hoàn Kiếm',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0245, longitude: 105.8412 }
    },
    restaurantInfo: {
      cuisineType: 'Việt Nam',
      minOrder: 30000,
      maxOrder: 300000,
      rating: 4.7
    }
  },
  {
    name: 'Gà Rán KFC Express',
    email: 'kfcexpress@restaurant.com',
    password: 'restaurant123',
    phone: '0901234570',
    ownerName: 'Phạm Thị Gà',
    address: {
      street: '54 Liễu Giai',
      district: 'Ba Đình',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0333, longitude: 105.8167 }
    },
    restaurantInfo: {
      cuisineType: 'Thức ăn nhanh',
      minOrder: 60000,
      maxOrder: 600000,
      rating: 4.5
    }
  },
  {
    name: 'Lẩu Thái Tomyum',
    email: 'lauthai@restaurant.com',
    password: 'restaurant123',
    phone: '0901234571',
    ownerName: 'Hoàng Văn Lẩu',
    address: {
      street: '89 Láng Hạ',
      district: 'Đống Đa',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0122, longitude: 105.8144 }
    },
    restaurantInfo: {
      cuisineType: 'Thái Lan',
      minOrder: 100000,
      maxOrder: 1000000,
      rating: 4.6
    }
  },
  {
    name: 'Cơm Tấm Sài Gòn',
    email: 'comtamsaigon@restaurant.com',
    password: 'restaurant123',
    phone: '0901234572',
    ownerName: 'Vũ Thị Cơm',
    address: {
      street: '45 Trần Duy Hưng',
      district: 'Cầu Giấy',
      city: 'Hà Nội',
      coordinates: { latitude: 21.0078, longitude: 105.7936 }
    },
    restaurantInfo: {
      cuisineType: 'Việt Nam',
      minOrder: 35000,
      maxOrder: 350000,
      rating: 4.4
    }
  }
];

const createRestaurantUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://caonguyenduy1612:DuyNguyen1612@cnpm.f0hqo.mongodb.net/CNPM?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    let createdCount = 0;
    let skippedCount = 0;

    for (const data of restaurantData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      
      if (existingUser) {
        console.log(`⏭️  User ${data.email} already exists - SKIPPED`);
        skippedCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create Location first
      const location = await Location.create({
        type: 'restaurant',
        coords: {
          latitude: data.address.coordinates.latitude,
          longitude: data.address.coordinates.longitude
        },
        address: `${data.address.street}, ${data.address.district}, ${data.address.city}`
      });

      // Create User first (to get ownerId)
      const user = await User.create({
        email: data.email,
        password: hashedPassword,
        name: data.ownerName,
        phone: data.phone,
        role: 'restaurant_owner',
        address: {
          street: data.address.street,
          district: data.address.district,
          city: data.address.city,
          coordinates: {
            latitude: data.address.coordinates.latitude,
            longitude: data.address.coordinates.longitude
          }
        },
        status: 'active'
      });

      // Create Restaurant with ownerId and locationId
      const restaurant = await Restaurant.create({
        name: data.name,
        phone: data.phone,
        address: `${data.address.street}, ${data.address.district}, ${data.address.city}`,
        locationId: location._id,
        image: `https://picsum.photos/seed/${data.name}/400/300`,
        minOrder: data.restaurantInfo.minOrder,
        maxOrder: data.restaurantInfo.maxOrder,
        rating: data.restaurantInfo.rating,
        status: 'active',
        ownerId: user._id
      });

      // Update user with restaurantId
      await User.findByIdAndUpdate(user._id, {
        restaurantId: restaurant._id
      });

      console.log(`✅ Created: ${data.name}`);
      console.log(`   📧 Email: ${data.email}`);
      console.log(`   🔑 Password: ${data.password}`);
      console.log(`   👤 Owner: ${data.ownerName}`);
      console.log(`   🏪 Restaurant ID: ${restaurant._id}`);
      console.log(`   👤 User ID: ${user._id}\n`);

      createdCount++;
    }

    console.log('='.repeat(60));
    console.log(`✅ Successfully created ${createdCount} restaurant users`);
    console.log(`⏭️  Skipped ${skippedCount} existing users`);
    console.log('='.repeat(60));
    console.log('\n📋 Login credentials for all restaurants:');
    console.log('Password for all: restaurant123\n');
    
    restaurantData.forEach((data, index) => {
      console.log(`${index + 1}. ${data.name}`);
      console.log(`   Email: ${data.email}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating restaurant users:', error);
    process.exit(1);
  }
};

createRestaurantUsers();

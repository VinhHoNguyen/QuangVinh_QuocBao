import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import User, { UserRole, UserStatus } from '../models/User';
import Location from '../models/Location';
import Restaurant, { RestaurantStatus } from '../models/Restaurant';
import Product, { ProductCategory } from '../models/Product';
import Drone, { DroneStatus } from '../models/Drone';

dotenv.config();

const MONGODB_URI = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Location.deleteMany({});
    await Restaurant.deleteMany({});
    await Product.deleteMany({});
    await Drone.deleteMany({});
    console.log('✅ Data cleared');

    // Seed Users
    console.log('👤 Seeding users...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const users = await User.insertMany([
      {
        email: 'admin@fooddelivery.com',
        name: 'System Admin',
        password: hashedPassword,
        phone: '0123456789',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'owner1@restaurant.com',
        name: 'Nguyen Van A',
        password: hashedPassword,
        phone: '0987654321',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'owner2@restaurant.com',
        name: 'Tran Thi B',
        password: hashedPassword,
        phone: '0976543210',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'owner3@restaurant.com',
        name: 'Le Van E',
        password: hashedPassword,
        phone: '0965432108',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'customer1@gmail.com',
        name: 'Le Van C',
        password: hashedPassword,
        phone: '0965432109',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'customer2@gmail.com',
        name: 'Pham Thi D',
        password: hashedPassword,
        phone: '0954321098',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'customer3@gmail.com',
        name: 'Hoang Van F',
        password: hashedPassword,
        phone: '0943210987',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Seed Locations
    console.log('📍 Seeding locations...');
    const locations = await Location.insertMany([
      {
        type: 'restaurant',
        coords: { latitude: 21.0285, longitude: 105.8542 },
        address: '36 Hang Bac, Hoan Kiem, Ha Noi',
      },
      {
        type: 'restaurant',
        coords: { latitude: 21.0297, longitude: 105.8549 },
        address: '12 Tran Hung Dao, Hoan Kiem, Ha Noi',
      },
      {
        type: 'restaurant',
        coords: { latitude: 21.0275, longitude: 105.8535 },
        address: '89 Hai Ba Trung, Hoan Kiem, Ha Noi',
      },
      {
        type: 'restaurant',
        coords: { latitude: 21.0302, longitude: 105.8556 },
        address: '45 Le Duan, Hoan Kiem, Ha Noi',
      },
      {
        type: 'restaurant',
        coords: { latitude: 21.0288, longitude: 105.8543 },
        address: '23 Nguyen Thai Hoc, Ba Dinh, Ha Noi',
      },
      {
        type: 'restaurant',
        coords: { latitude: 21.0280, longitude: 105.8540 },
        address: '67 Tran Phu, Ba Dinh, Ha Noi',
      },
      {
        type: 'drone_station',
        coords: { latitude: 21.0290, longitude: 105.8545 },
        address: 'Main Drone Station, Ha Noi',
      },
    ]);
    console.log(`✅ Created ${locations.length} locations`);

    // Seed Restaurants
    console.log('🏪 Seeding restaurants...');
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Bún Chả Hà Nội 36',
        phone: '0241234567',
        address: '36 Hang Bac, Hoan Kiem, Ha Noi',
        locationId: locations[0]._id,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500',
        minOrder: 50000,
        maxOrder: 5000000,
        rating: 4.8,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[1]._id,
      },
      {
        name: 'Bánh Mì Saigon',
        phone: '0242345678',
        address: '12 Tran Hung Dao, Hoan Kiem, Ha Noi',
        locationId: locations[1]._id,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500',
        minOrder: 40000,
        maxOrder: 3000000,
        rating: 4.7,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[2]._id,
      },
      {
        name: 'Cơm Tấm Huyền',
        phone: '0243456789',
        address: '89 Hai Ba Trung, Hoan Kiem, Ha Noi',
        locationId: locations[2]._id,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
        minOrder: 60000,
        maxOrder: 8000000,
        rating: 4.9,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[1]._id,
      },
      {
        name: 'Tàu Hủ Chiên Tàu Hủ',
        phone: '0244567890',
        address: '45 Le Duan, Hoan Kiem, Ha Noi',
        locationId: locations[3]._id,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        minOrder: 30000,
        maxOrder: 2000000,
        rating: 4.6,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[2]._id,
      },
      {
        name: 'Bánh Xèo Hải Phòng',
        phone: '0245678901',
        address: '23 Nguyen Thai Hoc, Ba Dinh, Ha Noi',
        locationId: locations[4]._id,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
        minOrder: 50000,
        maxOrder: 4000000,
        rating: 4.8,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[3]._id,
      },
      {
        name: 'Bún Thang Gà Đại Lộ',
        phone: '0246789012',
        address: '67 Tran Phu, Ba Dinh, Ha Noi',
        locationId: locations[5]._id,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
        minOrder: 50000,
        maxOrder: 5000000,
        rating: 4.7,
        status: RestaurantStatus.ACTIVE,
        ownerId: users[3]._id,
      },
    ]);
    console.log(`✅ Created ${restaurants.length} restaurants`);

    // Seed Products
    console.log('🍜 Seeding products...');
    const products = await Product.insertMany([
      // Bún Chả Hà Nội 36
      {
        restaurantId: restaurants[0]._id,
        name: 'Bún Chả Hà Nội',
        description: 'Bún chả nướng thơm lừng cùng nước chấm chuẩn vị Hà Nội',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'Nem Rán',
        description: 'Nem rán giòn vàng, nhân thịt tươi',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
        category: ProductCategory.APPETIZER,
        available: true,
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'Trà Đá',
        description: 'Trà đá mát lạnh giải nhiệt',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
      // Bánh Mì Saigon
      {
        restaurantId: restaurants[1]._id,
        name: 'Bánh Mì Thập Cẩm',
        description: 'Bánh mì kẹp đầy đủ các loại chả, thịt, trứng',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[1]._id,
        name: 'Bánh Mì Pâté',
        description: 'Bánh mì pâté thơm ngon, bơ tươi',
        price: 24000,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[1]._id,
        name: 'Cafe Sữa Đá',
        description: 'Cà phê sữa đá đậm đà truyền thống',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
      // Cơm Tấm Huyền
      {
        restaurantId: restaurants[2]._id,
        name: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm sườn nướng vàng, trứng ốp la',
        price: 52000,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[2]._id,
        name: 'Cơm Tấm Bì Chả',
        description: 'Cơm tấm bì chả truyền thống',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[2]._id,
        name: 'Nước Mía',
        description: 'Nước mía tươi mát, vắt nguyên chất',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
      // Tàu Hủ Chiên
      {
        restaurantId: restaurants[3]._id,
        name: 'Tàu Hủ Non Chiên',
        description: 'Tàu hủ non chiên vàng giòn, nhúng tương cua',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[3]._id,
        name: 'Đậu Hủ Sốt Cà',
        description: 'Đậu hủ sốt cà chua đậm đà',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[3]._id,
        name: 'Chè Đậu Xanh',
        description: 'Chè đậu xanh mát lạnh, béo ngậy',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        category: ProductCategory.DESSERT,
        available: true,
      },
      // Bánh Xèo Hải Phòng
      {
        restaurantId: restaurants[4]._id,
        name: 'Bánh Xèo Hải Phòng',
        description: 'Bánh xèo giòn rụm, có tôm, mực, rau sống',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[4]._id,
        name: 'Bánh Cuốn Tôm Thịt',
        description: 'Bánh cuốn tôm thịt mềm mại, nước chấm đậm đà',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[4]._id,
        name: 'Nước Chanh Dây',
        description: 'Nước chanh dây chua ngọt, mát lạnh',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
      // Bún Thang Gà Đại Lộ
      {
        restaurantId: restaurants[5]._id,
        name: 'Bún Thang Gà',
        description: 'Bún thang gà tươi, nước dùng thơm ngon, hành chiên giòn',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[5]._id,
        name: 'Phở Gà',
        description: 'Phở gà nước dùng trong veo, thịt gà mềm',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurants[5]._id,
        name: 'Trà Atiso',
        description: 'Trà atiso thanh nhiệt, tốt cho sức khỏe',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Seed Drones
    console.log('🚁 Seeding drones...');
    const drones = await Drone.insertMany([
      {
        code: 'DRONE-001',
        name: 'Sky Hawk 1',
        capacity: 5,
        battery: 100,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locations[6]._id,
      },
      {
        code: 'DRONE-002',
        name: 'Sky Hawk 2',
        capacity: 5,
        battery: 85,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locations[6]._id,
      },
      {
        code: 'DRONE-003',
        name: 'Sky Hawk 3',
        capacity: 10,
        battery: 100,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locations[6]._id,
      },
      {
        code: 'DRONE-004',
        name: 'Sky Hawk 4',
        capacity: 5,
        battery: 60,
        currentLoad: 0,
        status: DroneStatus.MAINTENANCE,
        currentLocationId: locations[6]._id,
      },
    ]);
    console.log(`✅ Created ${drones.length} drones`);

    console.log('\n=================================');
    console.log('🎉 Seeding completed successfully!');
    console.log('=================================');
    console.log(`👤 Users: ${users.length}`);
    console.log(`📍 Locations: ${locations.length}`);
    console.log(`🏪 Restaurants: ${restaurants.length}`);
    console.log(`🍜 Products: ${products.length}`);
    console.log(`🚁 Drones: ${drones.length}`);
    console.log('=================================\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seed();

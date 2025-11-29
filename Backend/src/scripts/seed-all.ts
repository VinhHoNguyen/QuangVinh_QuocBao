import mongoose from 'mongoose';
import dotenv from 'dotenv';
const bcrypt = require('bcrypt');
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Product from '../models/Product';
import Location from '../models/Location';
import Drone from '../models/Drone';
import Order, { OrderStatus, PaymentMethod, PaymentStatus } from '../models/Order';
import Payment from '../models/Payment';
import Delivery, { DeliveryStatus } from '../models/Delivery';
import Cart from '../models/Cart';

dotenv.config();

const seedAll = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/CNPM';
    await mongoose.connect(mongoUri);
    console.log('✓ Đã kết nối MongoDB');

    // Xóa toàn bộ dữ liệu cũ
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Product.deleteMany({});
    await Location.deleteMany({});
    await Drone.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Delivery.deleteMany({});
    console.log('✓ Đã xóa toàn bộ dữ liệu cũ');

    // ==================== 1. USERS ====================
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const usersData = [
      {
        email: 'admin@foodfast.vn',
        password: hashedPassword,
        name: 'Admin System',
        phone: '0900000000',
        role: 'admin',
      },
      {
        email: 'customer1@example.com',
        password: hashedPassword,
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        role: 'customer',
      },
      {
        email: 'customer2@example.com',
        password: hashedPassword,
        name: 'Trần Thị B',
        phone: '0912345678',
        role: 'customer',
      },
      {
        email: 'owner1@restaurant.vn',
        password: hashedPassword,
        name: 'Chủ Nhà Hàng Phở Hà Nội',
        phone: '0923456789',
        role: 'restaurant_owner',
      },
      {
        email: 'owner2@restaurant.vn',
        password: hashedPassword,
        name: 'Chủ Quán Cơm Tấm Sài Gòn',
        phone: '0934567890',
        role: 'restaurant_owner',
      },
    ];

    const users = await User.insertMany(usersData);
    console.log(`✓ Tạo ${users.length} users`);

    // ==================== 2. LOCATIONS ====================
    const locationsData = [
      {
        type: 'restaurant',
        coords: { latitude: 10.7769, longitude: 106.7009 },
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      },
      {
        type: 'restaurant',
        coords: { latitude: 10.7821, longitude: 106.6958 },
        address: '456 Lê Lợi, Quận 1, TP.HCM',
      },
      {
        type: 'restaurant',
        coords: { latitude: 10.7734, longitude: 106.7012 },
        address: '789 Đồng Khởi, Quận 1, TP.HCM',
      },
      {
        type: 'restaurant',
        coords: { latitude: 10.7692, longitude: 106.6954 },
        address: '321 Pasteur, Quận 1, TP.HCM',
      },
      {
        type: 'restaurant',
        coords: { latitude: 10.7801, longitude: 106.6999 },
        address: '654 Hai Bà Trưng, Quận 1, TP.HCM',
      },
      {
        type: 'restaurant',
        coords: { latitude: 10.7788, longitude: 106.7034 },
        address: '987 Lý Tự Trọng, Quận 1, TP.HCM',
      },
      {
        type: 'drone_station',
        coords: { latitude: 10.7756, longitude: 106.7019 },
        address: 'Trạm Drone Bến Thành, Quận 1, TP.HCM',
      },
      {
        type: 'drone_station',
        coords: { latitude: 10.7829, longitude: 106.6956 },
        address: 'Trạm Drone Công Viên 23/9, Quận 1, TP.HCM',
      },
    ];

    const locations = await Location.insertMany(locationsData);
    console.log(`✓ Tạo ${locations.length} locations`);

    // ==================== 3. RESTAURANTS ====================
    const restaurantsData = [
      {
        name: 'Phở Hà Nội',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        phone: '0281234567',
        email: 'phohanoi@example.com',
        locationId: locations[0]._id,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
        categories: ['Món Việt', 'Phở'],
        openTime: '06:00',
        closeTime: '22:00',
        isActive: true,
      },
      {
        name: 'Cơm Tấm Sài Gòn',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        phone: '0282345678',
        email: 'comtam@example.com',
        locationId: locations[1]._id,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
        categories: ['Món Việt', 'Cơm'],
        openTime: '07:00',
        closeTime: '21:00',
        isActive: true,
      },
      {
        name: 'Bánh Mì 362',
        address: '789 Đồng Khởi, Quận 1, TP.HCM',
        phone: '0283456789',
        email: 'banhmi362@example.com',
        locationId: locations[2]._id,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=800',
        categories: ['Món Việt', 'Bánh Mì'],
        openTime: '05:30',
        closeTime: '20:00',
        isActive: true,
      },
      {
        name: 'Lẩu Thái Tomyum',
        address: '321 Pasteur, Quận 1, TP.HCM',
        phone: '0284567890',
        email: 'lauthai@example.com',
        locationId: locations[3]._id,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        categories: ['Món Thái', 'Lẩu'],
        openTime: '10:00',
        closeTime: '23:00',
        isActive: true,
      },
      {
        name: 'Gà Rán KFC',
        address: '654 Hai Bà Trưng, Quận 1, TP.HCM',
        phone: '0285678901',
        email: 'kfc@example.com',
        locationId: locations[4]._id,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
        categories: ['Món Âu', 'Gà Rán'],
        openTime: '09:00',
        closeTime: '22:00',
        isActive: true,
      },
      {
        name: 'Sushi Tokyo',
        address: '987 Lý Tự Trọng, Quận 1, TP.HCM',
        phone: '0286789012',
        email: 'sushi@example.com',
        locationId: locations[5]._id,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        categories: ['Món Nhật', 'Sushi'],
        openTime: '11:00',
        closeTime: '22:30',
        isActive: true,
      },
    ];

    const restaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`✓ Tạo ${restaurants.length} restaurants`);

    // ==================== 4. PRODUCTS ====================
    const productsData = [
      // Phở Hà Nội
      { name: 'Phở Bò Tái', description: 'Phở bò tái truyền thống', price: 45000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', restaurantId: restaurants[0]._id, available: true },
      { name: 'Phở Gà', description: 'Phở gà thanh đạm', price: 40000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400', restaurantId: restaurants[0]._id, available: true },
      { name: 'Bún Chả Hà Nội', description: 'Bún chả nướng thơm ngon', price: 50000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', restaurantId: restaurants[0]._id, available: true },
      
      // Cơm Tấm Sài Gòn
      { name: 'Cơm Tấm Sườn Bì', description: 'Cơm tấm sườn nướng', price: 35000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400', restaurantId: restaurants[1]._id, available: true },
      { name: 'Cơm Tấm Gà Nướng', description: 'Cơm tấm gà nướng sả', price: 38000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', restaurantId: restaurants[1]._id, available: true },
      { name: 'Cơm Tấm Đặc Biệt', description: 'Cơm tấm full topping', price: 55000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', restaurantId: restaurants[1]._id, available: true },
      
      // Bánh Mì 362
      { name: 'Bánh Mì Thịt Nguội', description: 'Bánh mì thịt nguội truyền thống', price: 20000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400', restaurantId: restaurants[2]._id, available: true },
      { name: 'Bánh Mì Pate', description: 'Bánh mì pate đặc biệt', price: 18000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=400', restaurantId: restaurants[2]._id, available: true },
      { name: 'Bánh Mì Xíu Mại', description: 'Bánh mì xíu mại sốt cà', price: 25000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400', restaurantId: restaurants[2]._id, available: true },
      
      // Lẩu Thái
      { name: 'Lẩu Thái Hải Sản', description: 'Lẩu Thái hải sản tươi ngon', price: 250000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', restaurantId: restaurants[3]._id, available: true },
      { name: 'Lẩu Tomyum Gà', description: 'Lẩu tomyum cay chua', price: 180000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1606491956391-1c1b00f1543e?w=400', restaurantId: restaurants[3]._id, available: true },
      { name: 'Lẩu Thái Nấm', description: 'Lẩu Thái chay nấm', price: 150000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', restaurantId: restaurants[3]._id, available: true },
      
      // Gà Rán KFC
      { name: 'Gà Rán Giòn', description: 'Combo 3 miếng gà rán', price: 85000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', restaurantId: restaurants[4]._id, available: true },
      { name: 'Burger Gà', description: 'Burger gà giòn béo ngậy', price: 55000, category: 'Món Phụ', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', restaurantId: restaurants[4]._id, available: true },
      { name: 'Khoai Tây Chiên', description: 'Khoai tây chiên giòn', price: 25000, category: 'Món Phụ', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', restaurantId: restaurants[4]._id, available: true },
      
      // Sushi Tokyo
      { name: 'Sushi Cá Hồi', description: 'Set 8 miếng sushi cá hồi', price: 120000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', restaurantId: restaurants[5]._id, available: true },
      { name: 'Sashimi Tổng Hợp', description: 'Sashimi các loại cá', price: 200000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', restaurantId: restaurants[5]._id, available: true },
      { name: 'Maki Cuộn Tempura', description: 'Maki cuộn tôm tempura', price: 95000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400', restaurantId: restaurants[5]._id, available: true },
    ];

    const products = await Product.insertMany(productsData);
    console.log(`✓ Tạo ${products.length} products`);

    // ==================== 5. DRONES ====================
    const dronesData = [
      {
        model: 'DJI Mavic 3 Pro',
        status: 'available',
        batteryLevel: 95,
        currentLocationId: locations[6]._id,
        maxSpeed: 75,
        maxRange: 30,
        payloadCapacity: 5,
      },
      {
        model: 'DJI Phantom 5',
        status: 'available',
        batteryLevel: 88,
        currentLocationId: locations[6]._id,
        maxSpeed: 68,
        maxRange: 25,
        payloadCapacity: 4,
      },
      {
        model: 'Autel EVO II',
        status: 'in_use',
        batteryLevel: 72,
        currentLocationId: locations[7]._id,
        maxSpeed: 70,
        maxRange: 28,
        payloadCapacity: 4.5,
      },
      {
        model: 'DJI Air 2S',
        status: 'charging',
        batteryLevel: 45,
        currentLocationId: locations[6]._id,
        maxSpeed: 69,
        maxRange: 24,
        payloadCapacity: 3.5,
      },
      {
        model: 'Parrot Anafi USA',
        status: 'maintenance',
        batteryLevel: 0,
        currentLocationId: locations[7]._id,
        maxSpeed: 55,
        maxRange: 20,
        payloadCapacity: 3,
      },
    ];

    const drones = await Drone.insertMany(dronesData);
    console.log(`✓ Tạo ${drones.length} drones`);

    // ==================== 6. CARTS ====================
    const customer1 = users.find(u => u.role === 'customer');
    if (customer1) {
      const cartItems = [
        { productId: products[0]._id, quantity: 2, price: products[0].price },
        { productId: products[3]._id, quantity: 1, price: products[3].price },
      ];

      await Cart.create({
        userId: customer1._id,
        items: cartItems,
        totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      });
      console.log('✓ Tạo 1 giỏ hàng');
    }

    // ==================== 7. ORDERS ====================
    if (!customer1) {
      throw new Error('Không tìm thấy customer1');
    }

    const ordersData = [
      {
        userId: customer1._id,
        restaurantId: restaurants[0]._id,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[0]._id,
            productName: products[0].name,
            price: products[0].price,
            quantity: 2,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[1]._id,
            productName: products[1].name,
            price: products[1].price,
            quantity: 1,
          },
        ],
        totalPrice: products[0].price * 2 + products[1].price,
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.E_WALLET,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '123 Lê Lợi',
          ward: 'Phường Bến Thành',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: { latitude: 10.7756, longitude: 106.7019 },
        },
        notes: 'Giao giờ hành chính',
      },
      {
        userId: customer1._id,
        restaurantId: restaurants[1]._id,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[3]._id,
            productName: products[3].name,
            price: products[3].price,
            quantity: 3,
          },
        ],
        totalPrice: products[3].price * 3,
        status: OrderStatus.DELIVERING,
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '456 Nguyễn Huệ',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: { latitude: 10.7743, longitude: 106.7044 },
        },
      },
      {
        userId: customer1._id,
        restaurantId: restaurants[5]._id,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[15]._id,
            productName: products[15].name,
            price: products[15].price,
            quantity: 1,
          },
        ],
        totalPrice: products[15].price,
        status: OrderStatus.PREPARING,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '789 Hai Bà Trưng',
          ward: 'Phường Đa Kao',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: { latitude: 10.7878, longitude: 106.6933 },
        },
      },
      {
        userId: customer1._id,
        restaurantId: restaurants[2]._id,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[6]._id,
            productName: products[6].name,
            price: products[6].price,
            quantity: 2,
          },
        ],
        totalPrice: products[6].price * 2,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '234 Võ Văn Tần',
          ward: 'Phường 5',
          district: 'Quận 3',
          city: 'TP.HCM',
          coordinates: { latitude: 10.7726, longitude: 106.6901 },
        },
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.log(`✓ Tạo ${orders.length} orders`);

    // ==================== 8. PAYMENTS ====================
    const paymentsData = orders.map(order => ({
      orderId: order._id,
      amount: order.totalPrice,
      method: order.paymentMethod,
      status: order.paymentStatus,
      transactionId: order.paymentStatus === PaymentStatus.COMPLETED 
        ? `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : undefined,
    }));

    const payments = await Payment.insertMany(paymentsData);
    console.log(`✓ Tạo ${payments.length} payments`);

    // ==================== 9. DELIVERIES ====================
    const deliveriesData = [];
    
    for (const order of orders) {
      if ([OrderStatus.PREPARING, OrderStatus.DELIVERING, OrderStatus.DELIVERED].includes(order.status)) {
        const restaurant = restaurants.find(r => r._id.equals(order.restaurantId));
        const restaurantLocation = locations.find(l => l._id.equals(restaurant?.locationId));
        
        deliveriesData.push({
          orderId: order._id,
          droneId: order.status === OrderStatus.DELIVERED || order.status === OrderStatus.DELIVERING 
            ? drones[0]._id
            : undefined,
          pickupLocationId: restaurantLocation?._id || locations[0]._id,
          dropoffLocationId: locations[0]._id,
          status: order.status === OrderStatus.DELIVERED ? DeliveryStatus.DELIVERED 
            : order.status === OrderStatus.DELIVERING ? DeliveryStatus.IN_TRANSIT 
            : DeliveryStatus.ASSIGNED,
          estimatedTime: new Date(Date.now() + 30 * 60000),
          actualTime: order.status === OrderStatus.DELIVERED 
            ? new Date(Date.now() - 10 * 60000) 
            : undefined,
        });
      }
    }

    if (deliveriesData.length > 0) {
      const deliveries = await Delivery.insertMany(deliveriesData);
      console.log(`✓ Tạo ${deliveries.length} deliveries`);
    }

    // ==================== THỐNG KÊ ====================
    console.log('\n✅ HOÀN THÀNH IMPORT DỮ LIỆU VÀO MONGODB!');
    console.log('='.repeat(50));
    console.log('📊 THỐNG KÊ DỮ LIỆU:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   🏪 Restaurants: ${await Restaurant.countDocuments()}`);
    console.log(`   🍔 Products: ${await Product.countDocuments()}`);
    console.log(`   📍 Locations: ${await Location.countDocuments()}`);
    console.log(`   🚁 Drones: ${await Drone.countDocuments()}`);
    console.log(`   🛒 Carts: ${await Cart.countDocuments()}`);
    console.log(`   📦 Orders: ${await Order.countDocuments()}`);
    console.log(`   💳 Payments: ${await Payment.countDocuments()}`);
    console.log(`   🚚 Deliveries: ${await Delivery.countDocuments()}`);
    console.log('='.repeat(50));
    console.log('\n🔐 THÔNG TIN ĐĂNG NHẬP:');
    console.log('   Email: admin@foodfast.vn | customer1@example.com');
    console.log('   Password: 123456');
    console.log('='.repeat(50));

    await mongoose.connection.close();
    console.log('\n✓ Đã đóng kết nối MongoDB');

  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedAll();

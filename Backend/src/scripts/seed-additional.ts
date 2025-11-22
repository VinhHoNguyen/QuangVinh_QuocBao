import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Order, { OrderStatus, PaymentMethod, PaymentStatus } from '../models/Order';
import Payment from '../models/Payment';
import Delivery, { DeliveryStatus } from '../models/Delivery';
import Cart from '../models/Cart';
import Location from '../models/Location';
import Restaurant from '../models/Restaurant';
import Product from '../models/Product';

dotenv.config();

const seedAdditionalData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/CNPM';
    await mongoose.connect(mongoUri);
    console.log('✓ Đã kết nối MongoDB');

    // Lấy dữ liệu có sẵn
    const users = await User.find();
    const restaurants = await Restaurant.find();
    const products = await Product.find();
    const locations = await Location.find();

    if (users.length === 0 || restaurants.length === 0 || products.length === 0) {
      console.log('⚠️ Cần chạy seed-mongo.ts trước để tạo User, Restaurant, Product, Location');
      process.exit(1);
    }

    // Lấy customer đầu tiên
    const customer1 = users.find(u => u.role === 'customer') || users[0];
    if (!customer1) {
      console.log('⚠️ Không tìm thấy user nào. Vui lòng chạy seed-mongo.ts trước');
      process.exit(1);
    }

    // Xóa dữ liệu cũ
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Delivery.deleteMany({});
    console.log('✓ Đã xóa dữ liệu cũ của Cart, Order, Payment, Delivery');

    // 1. TẠO GIỎ HÀNG MẪU (Cart)
    const sampleProducts = products.slice(0, 3);
    const cartItems = sampleProducts.map(product => ({
      productId: product._id,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: product.price,
    }));

    await Cart.create({
      userId: customer1._id,
      items: cartItems,
      totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    });
    console.log(`✓ Tạo giỏ hàng cho ${customer1.name}`);

    // 2. LẤY LOCATION (sử dụng location có sẵn)
    const customerLocation = locations[0]; // Lấy location đầu tiên làm địa chỉ giao hàng

    // 3. TẠO ĐỚN HÀNG MẪU (Orders)
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
          coordinates: {
            latitude: 10.7756,
            longitude: 106.7019,
          },
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
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: {
          street: '456 Nguyễn Huệ',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: {
            latitude: 10.7743,
            longitude: 106.7044,
          },
        },
        notes: 'Không gọi chuông',
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
            quantity: 1,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[7]._id,
            productName: products[7].name,
            price: products[7].price,
            quantity: 2,
          },
        ],
        totalPrice: products[6].price + products[7].price * 2,
        status: OrderStatus.PREPARING,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentStatus: PaymentStatus.COMPLETED,
        shippingAddress: {
          street: '789 Hai Bà Trưng',
          ward: 'Phường Đa Kao',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: {
            latitude: 10.7878,
            longitude: 106.6933,
          },
        },
      },
      {
        userId: customer1._id,
        restaurantId: restaurants[0]._id,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            productId: products[2]._id,
            productName: products[2].name,
            price: products[2].price,
            quantity: 1,
          },
        ],
        totalPrice: products[2].price,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: {
          street: '123 Lê Lợi',
          ward: 'Phường Bến Thành',
          district: 'Quận 1',
          city: 'TP.HCM',
          coordinates: {
            latitude: 10.7756,
            longitude: 106.7019,
          },
        },
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.log(`✓ Tạo ${orders.length} đơn hàng mẫu`);

    // 4. TẠO THANH TOÁN (Payments)
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
    console.log(`✓ Tạo ${payments.length} bản ghi thanh toán`);

    // 5. TẠO GIAO HÀNG (Deliveries) - chỉ cho đơn đã xác nhận
    const deliveriesData = [];
    
    // Lấy drone nếu có
    const drones = await mongoose.connection.collection('drones').find().toArray();
    const droneId = drones.length > 0 ? drones[0]._id : undefined;

    for (const order of orders) {
      if ([OrderStatus.PREPARING, OrderStatus.DELIVERING, OrderStatus.DELIVERED].includes(order.status)) {
        const restaurantLocation = locations.find(l => l.type === 'restaurant') || locations[0];
        
        deliveriesData.push({
          orderId: order._id,
          droneId: order.status === OrderStatus.DELIVERED || order.status === OrderStatus.DELIVERING 
            ? droneId
            : undefined,
          pickupLocationId: restaurantLocation._id,
          dropoffLocationId: customerLocation._id,
          status: order.status === OrderStatus.DELIVERED ? DeliveryStatus.DELIVERED 
            : order.status === OrderStatus.DELIVERING ? DeliveryStatus.IN_TRANSIT 
            : DeliveryStatus.ASSIGNED,
          estimatedTime: new Date(Date.now() + 30 * 60000), // +30 phút
          actualTime: order.status === OrderStatus.DELIVERED 
            ? new Date(Date.now() - 10 * 60000) 
            : undefined,
        });
      }
    }

    if (deliveriesData.length > 0) {
      const deliveries = await Delivery.insertMany(deliveriesData);
      console.log(`✓ Tạo ${deliveries.length} đơn giao hàng`);
    }

    console.log('\n✅ HOÀN THÀNH SEED DỮ LIỆU BỔ SUNG!');
    console.log('📊 Thống kê:');
    console.log(`   - Giỏ hàng: ${await Cart.countDocuments()}`);
    console.log(`   - Đơn hàng: ${await Order.countDocuments()}`);
    console.log(`   - Thanh toán: ${await Payment.countDocuments()}`);
    console.log(`   - Giao hàng: ${await Delivery.countDocuments()}`);

    await mongoose.connection.close();
    console.log('\n✓ Đã đóng kết nối MongoDB');

  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedAdditionalData();

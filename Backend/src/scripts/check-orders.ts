import mongoose from 'mongoose';
import '../models/Order';
import '../models/Restaurant';
import '../models/User';

const Order = mongoose.model('Order');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');

const checkOrders = async () => {
  try {
    const mongoUri = 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get all orders
    const allOrders = await Order.find().sort({ createdAt: -1 });
    console.log(`📦 Total orders in database: ${allOrders.length}\n`);

    if (allOrders.length > 0) {
      console.log('📋 Latest 10 orders:');
      for (const order of allOrders.slice(0, 10)) {
        const restaurant = await Restaurant.findById(order.restaurantId);
        console.log('='.repeat(80));
        console.log(`📋 Order ID: ${order._id}`);
        console.log(`   Restaurant ID: ${order.restaurantId}`);
        console.log(`   Restaurant Name: ${restaurant ? restaurant.name : '⚠️  NOT FOUND!'}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ${order.totalPrice}đ`);
        console.log(`   Items: ${order.items?.length || 0}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      }
    } else {
      console.log('❌ No orders found in database!');
    }

    // Get all restaurants with owners and order counts
    const restaurants = await Restaurant.find();
    console.log('='.repeat(80));
    console.log(`\n🏪 Total restaurants: ${restaurants.length}\n`);
    
    for (const rest of restaurants) {
      const owner = await User.findById(rest.ownerId);
      const orderCount = await Order.countDocuments({ restaurantId: rest._id });
      
      console.log(`Restaurant: ${rest.name}`);
      console.log(`   ID: ${rest._id}`);
      console.log(`   Owner ID: ${rest.ownerId}`);
      console.log(`   Owner Email: ${owner ? owner.email : '⚠️  NO OWNER'}`);
      console.log(`   Total Orders: ${orderCount}`);
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkOrders();

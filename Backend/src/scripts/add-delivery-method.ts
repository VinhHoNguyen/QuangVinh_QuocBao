import mongoose from 'mongoose';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery';

async function addDeliveryMethodToOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all orders without deliveryMethod to have default 'drone'
    const result = await Order.updateMany(
      { deliveryMethod: { $exists: false } },
      { $set: { deliveryMethod: 'drone' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} orders with deliveryMethod: 'drone'`);

    // Show sample of updated orders
    const sampleOrders = await Order.find().limit(3).select('_id deliveryMethod status');
    console.log('\nSample orders:');
    sampleOrders.forEach(order => {
      console.log(`- Order ${order._id}: deliveryMethod=${order.deliveryMethod}, status=${order.status}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Script completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addDeliveryMethodToOrders();

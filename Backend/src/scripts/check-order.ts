import * as dotenv from 'dotenv';
import connectDB from '../config/mongodb';
import OrderModel from '../models/Order';
import DeliveryModel from '../models/Delivery';

dotenv.config();

async function checkOrder() {
    try {
        await connectDB();

        const orderId = '69297d1b82e0d8917c229dc8';

        console.log(`\n🔍 Checking order: ${orderId}\n`);

        // Check if order exists
        const order = await OrderModel.findById(orderId);
        if (!order) {
            console.log('❌ Order NOT FOUND in database');
            process.exit(1);
        }

        console.log('✅ Order EXISTS');
        console.log(`   Status: ${order.status}`);
        console.log(`   Created: ${order.createdAt}`);

        // Check for delivery
        const delivery = await DeliveryModel.findOne({ orderId: order._id });

        if (!delivery) {
            console.log('\n❌ Delivery record NOT FOUND');
            console.log('   → Order was created WITHOUT delivery record');
            console.log('   → Backend is running OLD CODE');
        } else {
            console.log('\n✅ Delivery record EXISTS');
            console.log(`   Status: ${delivery.status}`);
            console.log(`   Drone ID: ${delivery.droneId || 'None'}`);
            console.log(`   Created: ${delivery.createdAt}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkOrder();

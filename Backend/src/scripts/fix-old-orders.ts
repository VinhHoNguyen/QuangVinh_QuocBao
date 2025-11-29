import * as dotenv from 'dotenv';
import connectDB from '../config/mongodb';
import OrderModel from '../models/Order';
import DeliveryModel, { DeliveryStatus } from '../models/Delivery';
import LocationModel from '../models/Location';
import { LocationType } from '../models/types';

dotenv.config();

async function fixOldOrders() {
    try {
        console.log('🔧 Connecting to database...');
        await connectDB();

        console.log('📦 Finding orders without delivery records...');
        const orders = await OrderModel.find({});

        let fixed = 0;
        let skipped = 0;

        for (const order of orders) {
            // Check if delivery already exists
            const existingDelivery = await DeliveryModel.findOne({ orderId: order._id });

            if (existingDelivery) {
                skipped++;
                continue;
            }

            console.log(`\n📝 Creating delivery for order: ${order._id}`);

            // Create delivery location
            const deliveryLocation = await LocationModel.create({
                type: LocationType.CUSTOMER,
                coords: order.shippingAddress?.coordinates || { latitude: 10.772622, longitude: 106.670172 },
                address: `${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`,
            });

            // Get or create restaurant location
            let restaurantLocation = await LocationModel.findOne({
                type: LocationType.RESTAURANT,
            });

            if (!restaurantLocation) {
                restaurantLocation = await LocationModel.create({
                    type: LocationType.RESTAURANT,
                    coords: { latitude: 10.762622, longitude: 106.660172 },
                    address: 'Default Restaurant Location',
                });
            }

            // Create delivery record
            await DeliveryModel.create({
                orderId: order._id,
                pickupLocationId: restaurantLocation._id,
                dropoffLocationId: deliveryLocation._id,
                status: DeliveryStatus.ASSIGNED,
                estimatedTime: new Date(Date.now() + 30 * 60 * 1000),
            });

            fixed++;
            console.log(`✅ Created delivery for order ${order._id}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Fixed ${fixed} orders`);
        console.log(`⏭️  Skipped ${skipped} orders (already have delivery)`);
        console.log('='.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixOldOrders();

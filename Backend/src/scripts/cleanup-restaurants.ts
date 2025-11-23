import mongoose from 'mongoose';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Location from '../models/Location';
import Order from '../models/Order';

async function cleanupRestaurants() {
  try {
    await mongoose.connect('mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB\n');

    // IDs của 3 nhà hàng cần xóa (nhà hàng thứ 2 của mỗi owner)
    const restaurantsToDelete = [
      { id: '69217e464a1aabf9a1b1a94c', name: 'Cơm Tấm Huyền' },
      { id: '69217e464a1aabf9a1b1a94d', name: 'Tàu Hủ Chiên Tàu Hủ' },
      { id: '69217e464a1aabf9a1b1a94f', name: 'Bún Thang Gà Đại Lộ' }
    ];

    console.log('🗑️  Deleting duplicate restaurants...\n');

    for (const rest of restaurantsToDelete) {
      const restaurant = await Restaurant.findById(rest.id);
      
      if (!restaurant) {
        console.log(`⏭️  Not found: ${rest.name}`);
        continue;
      }

      // Delete associated location
      if (restaurant.locationId) {
        await Location.findByIdAndDelete(restaurant.locationId);
        console.log(`   🗑️  Deleted location for ${rest.name}`);
      }

      // Update orders to point to a valid restaurant (optional - or delete orders)
      const orderCount = await Order.countDocuments({ restaurantId: rest.id });
      if (orderCount > 0) {
        console.log(`   ⚠️  Found ${orderCount} orders for ${rest.name} - will be orphaned`);
      }

      // Delete restaurant
      await Restaurant.findByIdAndDelete(rest.id);
      console.log(`✅ Deleted: ${rest.name}\n`);
    }

    console.log('='.repeat(60));
    console.log('✅ Cleanup complete!');
    console.log('='.repeat(60));

    // Rename remaining restaurants
    console.log('\n📝 Renaming remaining restaurants...\n');

    const renames = [
      { 
        id: '69217e464a1aabf9a1b1a94a', 
        oldName: 'Bún Chả Hà Nội 36',
        newName: 'Nhà Hàng A',
        email: 'banhmihoian@restaurant.com',
        newEmail: 'restaurant_a@example.com'
      },
      { 
        id: '69217e464a1aabf9a1b1a94b', 
        oldName: 'Bánh Mì Saigon',
        newName: 'Nhà Hàng B',
        email: 'kfcexpress@restaurant.com',
        newEmail: 'restaurant_b@example.com'
      },
      { 
        id: '69217e464a1aabf9a1b1a94e', 
        oldName: 'Bánh Xèo Hải Phòng',
        newName: 'Nhà Hàng C',
        email: 'comtamsaigon@restaurant.com',
        newEmail: 'restaurant_c@example.com'
      }
    ];

    for (const rename of renames) {
      // Update restaurant name
      await Restaurant.findByIdAndUpdate(rename.id, {
        name: rename.newName
      });

      // Update user email
      const user = await User.findOne({ email: rename.email });
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          email: rename.newEmail
        });
        
        console.log(`✅ ${rename.oldName} → ${rename.newName}`);
        console.log(`   📧 ${rename.email} → ${rename.newEmail}\n`);
      }
    }

    console.log('='.repeat(60));
    console.log('✅ Rename complete!');
    console.log('='.repeat(60));

    // Show final state
    const restaurants = await Restaurant.find({});
    console.log(`\n🏪 Final restaurants: ${restaurants.length}\n`);

    for (const rest of restaurants) {
      const user = await User.findById(rest.ownerId);
      const orderCount = await Order.countDocuments({ restaurantId: rest._id });
      
      console.log(`📦 ${rest.name}`);
      console.log(`   ID: ${rest._id}`);
      console.log(`   Owner: ${user?.email || 'N/A'}`);
      console.log(`   Orders: ${orderCount}\n`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupRestaurants();

import mongoose from 'mongoose';
import User from '../models/User';

async function deleteDuplicateUsers() {
  try {
    await mongoose.connect('mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB\n');

    const emailsToDelete = [
      'restaurant1@example.com',
      'restaurant2@example.com',
      'restaurant3@example.com',
      'restaurant4@example.com',
      'restaurant5@example.com',
      'restaurant6@example.com'
    ];

    console.log('🗑️  Deleting duplicate users...\n');

    for (const email of emailsToDelete) {
      const user = await User.findOne({ email });
      
      if (user) {
        await User.findByIdAndDelete(user._id);
        console.log(`✅ Deleted: ${email} (ID: ${user._id})`);
      } else {
        console.log(`⏭️  Not found: ${email}`);
      }
    }

    console.log('\n='.repeat(60));
    console.log('✅ Cleanup complete!');
    console.log('='.repeat(60));

    // Verify remaining users
    const remainingUsers = await User.find({ role: 'restaurant_owner' });
    console.log(`\n👥 Remaining restaurant owners: ${remainingUsers.length}`);
    
    for (const user of remainingUsers) {
      console.log(`   📧 ${user.email} (RestaurantId: ${user.restaurantId})`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteDuplicateUsers();

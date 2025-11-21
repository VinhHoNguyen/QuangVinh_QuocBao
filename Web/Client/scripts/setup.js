// Setup script to initialize the application
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Food Delivery Application...\n');

// Check .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envExample = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envPath);
    console.log('✅ .env.local created\n');
  }
}

console.log('📋 Setup Checklist:\n');
console.log('1. ✅ Install dependencies: npm install --legacy-peer-deps');
console.log('2. ⚠️  Configure Firebase in Backend/.env');
console.log('3. ⚠️  Run Backend seed script: cd Backend && npm run seed');
console.log('4. ⚠️  Start Backend server: cd Backend && npm run dev');
console.log('5. ⚠️  Start Frontend: npm run dev');
console.log('\n📚 Documentation:');
console.log('   - Backend API: http://localhost:5000/api');
console.log('   - Frontend: http://localhost:3000');
console.log('   - API Docs: See Backend/README.md');
console.log('\n🔑 Test Accounts:');
console.log('   Admin: admin@fooddelivery.com / Admin@123');
console.log('   Owner: owner1@restaurant.com / Owner@123');
console.log('   Customer: customer1@gmail.com / Customer@123');
console.log('\n✨ Setup complete! Follow the checklist above.\n');

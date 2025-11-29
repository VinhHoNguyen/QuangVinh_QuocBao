import * as dotenv from 'dotenv';
import app from './app';
import connectDB from './config/mongodb';
import { getLocalNetworkIP } from './utils/network';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = parseInt(process.env.PORT || '5000', 10);
const networkIP = getLocalNetworkIP();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🔗 Network: http://${networkIP}:${PORT}`);
  console.log(`📱 Mobile API URL: http://${networkIP}:${PORT}/api`);
  console.log('=================================');
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

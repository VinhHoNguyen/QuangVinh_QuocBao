import * as dotenv from 'dotenv';
import app from './app';
import connectDB from './config/mongodb';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
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

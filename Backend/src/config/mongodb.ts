import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('=================================');
    console.log(' MongoDB Connected Successfully');
    console.log(` Database: CNPM`);
    console.log(` Host: ${mongoose.connection.host}`);
    console.log('=================================');
  } catch (error) {
    console.error(' MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log(' MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(' MongoDB error:', err);
});

export default connectDB;
export { mongoose };

// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_db_name'); // Removed deprecated options
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit if connection fails
  }
};

export default connectDB;


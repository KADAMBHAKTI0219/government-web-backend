import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cg_awards_db';
    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected successfully to host: ${conn.connection.host} [Database: ${conn.connection.name}]`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

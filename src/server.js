import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { seedDatabase } from './seeders/seedAdminAndRoles.js';
import CategoryService from './services/CategoryService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Run auto-seeder to guarantee initial Roles & Super Admin account exist
    await seedDatabase();

    // Preload Category RAM Cache for instant 0ms responses
    await CategoryService.preloadCache();

    const server = app.listen(PORT, () => {
      logger.info(`===================================================`);
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`API Base URL: http://localhost:${PORT}/api/v1`);
      logger.info(`Health Endpoint: http://localhost:${PORT}/api/v1/health`);
      logger.info(`Swagger Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`===================================================`);
    });

    // Unhandled Rejection & Exception Handlers
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Promise Rejection: ${err.stack || err.message}`);
    });

    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.stack || err.message}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

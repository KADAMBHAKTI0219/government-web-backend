import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDatabase } from './seeders/seedAdminAndRoles.js';

dotenv.config();

const runSeed = async () => {
  await seedDatabase();
};

runSeed();

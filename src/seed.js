import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDatabase } from './seeders/seedAdminAndRoles.js';
import { seedCategories } from './seeders/seedCategories.js';

dotenv.config();

const runSeed = async () => {
  try {
    await seedDatabase();
    await seedCategories();
    console.log('All 39 categories across 11 tiers and database setup seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

runSeed();

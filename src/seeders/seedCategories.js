import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import logger from '../utils/logger.js';

dotenv.config();

export const seedCategories = async () => {
  try {
    await connectDB();

    logger.info('===============================================');
    logger.info('Starting Clean 39 Categories across 11 Tiers Seeding...');
    logger.info('===============================================');

    // Clear old/outdated category entries from database
    await Category.deleteMany({});
    logger.info('Cleared old category collection completely.');

    const categoriesJsonPath = new URL('./categories.json', import.meta.url);
    const categoriesList = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'));

    let insertedCount = 0;
    for (const cat of categoriesList) {
      await Category.create(cat);
      insertedCount++;
    }

    logger.info(`Successfully seeded exactly ${insertedCount} categories across 11 tiers into MongoDB.`);
    logger.info('Category Seeding completed cleanly!');
    
    if (process.argv[1] && process.argv[1].includes('seedCategories.js')) {
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Category seeding failed: ${error.message}`);
    if (process.argv[1] && process.argv[1].includes('seedCategories.js')) {
      process.exit(1);
    }
  }
};

if (process.argv[1] && process.argv[1].includes('seedCategories.js')) {
  seedCategories();
}

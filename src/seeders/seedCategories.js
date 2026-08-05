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
    logger.info('Starting Category Database Seeding...');
    logger.info('===============================================');

    const categoriesJsonPath = new URL('./categories.json', import.meta.url);
    const categoriesList = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'));

    let insertedCount = 0;
    for (const cat of categoriesList) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, returnDocument: 'after' }
      );
      insertedCount++;
    }

    logger.info(`Successfully seeded/updated ${insertedCount} categories in MongoDB.`);
    logger.info('Seeding completed cleanly!');
    process.exit(0);
  } catch (error) {
    logger.error(`Category seeding failed: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].includes('seedCategories.js')) {
  seedCategories();
}

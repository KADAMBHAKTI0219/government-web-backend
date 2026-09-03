import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import CMS from '../models/CMS.js';
import Settings from '../models/Settings.js';
import Location from '../models/Location.js';
import { DEFAULT_LOCATIONS_DATA } from '../controllers/LocationController.js';
import { ROLES } from '../constants/roles.js';
import logger from '../utils/logger.js';

import fs from 'fs';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    logger.info('===============================================');
    logger.info('Starting Chhattisgarh Awards Database Seeding...');
    logger.info('===============================================');

    // 1. Seed Roles in parallel
    const rolesList = [
      { name: ROLES.SUPER_ADMIN, description: 'Full System Control & Admin Management', isSystemRole: true },
      { name: ROLES.ADMIN, description: 'Manage Applications, Categories & Jury', isSystemRole: true },
      { name: ROLES.MODERATOR, description: 'Content moderation & query support', isSystemRole: true },
      { name: ROLES.JURY, description: 'Review and score assigned nominations', isSystemRole: true },
      { name: ROLES.CREATOR, description: 'Nomination applicant & profile owner', isSystemRole: true },
      { name: ROLES.PUBLIC_USER, description: 'Public visitor & voter', isSystemRole: true }
    ];

    await Promise.all(
      rolesList.map(roleData =>
        Role.findOneAndUpdate({ name: roleData.name }, roleData, { upsert: true, returnDocument: 'after' })
      )
    );
    logger.info('System Roles seeded successfully.');

    // 2. Seed Super Admin Account
    const superAdminEmail = 'admin@gmail.com';
    let superAdmin = await User.findOne({ email: superAdminEmail });

    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'System Administrator',
        email: superAdminEmail,
        password: 'password123',
        phone: '9999999999',
        role: ROLES.SUPER_ADMIN,
        district: 'Raipur',
        state: 'Chhattisgarh',
        isEmailVerified: true,
        isActive: true,
        isProfileComplete: true
      });
      logger.info(`Created default Super Admin user: ${superAdminEmail} (password: password123)`);
    } else {
      logger.info(`Super Admin user ${superAdminEmail} already exists.`);
    }

    // 3. Seed Default Locations (States & Districts/Cities) if empty
    const locCount = await Location.countDocuments();
    if (locCount === 0) {
      for (const item of DEFAULT_LOCATIONS_DATA) {
        await Location.create(item);
      }
      logger.info(`Initialized ${DEFAULT_LOCATIONS_DATA.length} default states & nested districts.`);
    } else {
      logger.info(`Locations dataset already present (${locCount} states).`);
    }

    // 4. Seed Default Award Categories in parallel if collection is empty
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      const categoriesJsonPath = new URL('./categories.json', import.meta.url);
      const sampleCategories = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'));
      await Promise.all(
        sampleCategories.map(cat => Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true }))
      );
      logger.info(`${sampleCategories.length} Award Categories initialized successfully.`);
    } else {
      logger.info(`Award Categories already initialized (${catCount} categories present).`);
    }

    // 5. Seed Default CMS Data & Settings in parallel
    const cmsDefaults = [
      {
        key: 'hero',
        title: 'Chhattisgarh State Creator & Influencer Awards 2026',
        subtitle: 'Honoring digital creators, storytellers, and innovators of Chhattisgarh.',
        content: {
          ctaText: 'Nominate Now',
          bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&q=80'
        }
      },
      {
        key: 'about',
        title: 'About the Awards',
        subtitle: 'An initiative by the Government of Chhattisgarh',
        content: {
          description: 'The Chhattisgarh Creator Awards aim to empower local talent across arts, culture, technology, tourism, and civic storytelling.'
        }
      }
    ];

    await Promise.all([
      ...cmsDefaults.map(cmsItem =>
        CMS.findOneAndUpdate({ key: cmsItem.key }, cmsItem, { upsert: true, returnDocument: 'after' })
      ),
      Settings.findOneAndUpdate({}, { isVotingEnabled: true, isRegistrationOpen: true, isNominationOpen: true }, { upsert: true, returnDocument: 'after' })
    ]);
    logger.info('CMS default content & Portal settings initialized successfully.');

    logger.info('Seeding completed cleanly!');


    if (process.argv[1] && process.argv[1].includes('seedAdminAndRoles.js')) {
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    if (process.argv[1] && process.argv[1].includes('seedAdminAndRoles.js')) {
      process.exit(1);
    }
  }
};

if (process.argv[1] && process.argv[1].includes('seedAdminAndRoles.js')) {
  seedDatabase();
}

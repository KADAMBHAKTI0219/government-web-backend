import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import CMS from '../models/CMS.js';
import Settings from '../models/Settings.js';
import { ROLES } from '../constants/roles.js';
import logger from '../utils/logger.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    logger.info('===============================================');
    logger.info('Starting Chhattisgarh Awards Database Seeding...');
    logger.info('===============================================');

    // 1. Seed Roles
    const rolesList = [
      { name: ROLES.SUPER_ADMIN, description: 'Full System Control & Admin Management', isSystemRole: true },
      { name: ROLES.ADMIN, description: 'Manage Applications, Categories & Jury', isSystemRole: true },
      { name: ROLES.MODERATOR, description: 'Content moderation & query support', isSystemRole: true },
      { name: ROLES.JURY, description: 'Review and score assigned nominations', isSystemRole: true },
      { name: ROLES.CREATOR, description: 'Nomination applicant & profile owner', isSystemRole: true },
      { name: ROLES.PUBLIC_USER, description: 'Public visitor & voter', isSystemRole: true }
    ];

    for (const roleData of rolesList) {
      await Role.findOneAndUpdate({ name: roleData.name }, roleData, { upsert: true, returnDocument: 'after' });
    }
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

    // 3. Seed Default Award Categories
    const sampleCategories = [
      {
        title: 'Chhattisgarhiya Sanskriti Ambassador',
        slug: 'chhattisgarhiya-sanskriti-ambassador',
        tier: 'A_CULTURE_IDENTITY',
        shortDescription: 'Celebrating creators showcasing regional heritage, folk music, and local cultural traditions.',
        taskBrief: 'Create an engaging video highlighting traditional art, dance, or folk festivals of Chhattisgarh.',
        hashtag: '#ChhattisgarhiyaSanskriti',
        prizeTier: 'FLAGSHIP',
        cashPrizeMin: 50000,
        cashPrizeMax: 500000,
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        title: 'Tech & Civic Innovation Pioneer',
        slug: 'tech-civic-innovation-pioneer',
        tier: 'B_NATION_STATE_BUILDING',
        shortDescription: 'Honoring creators bringing awareness to AI, smart governance, and infrastructure development.',
        taskBrief: 'Produce a video demonstrating how digital initiatives improve public services and citizen welfare.',
        hashtag: '#GovTechBuilder',
        prizeTier: 'MARQUEE',
        cashPrizeMin: 25000,
        cashPrizeMax: 300000,
        isActive: true,
        isFeatured: true,
        order: 2
      },
      {
        title: 'Digital Craftsman & Micro-Creator',
        slug: 'digital-craftsman-micro-creator',
        tier: 'C_CRAFT_PLATFORM',
        shortDescription: 'Spotlighting emerging nano creators, digital artists, and handicraft storytellers.',
        taskBrief: 'Share a story celebrating local artisan skills, handlooms, or sustainable eco-crafts.',
        hashtag: '#MicroCraftCreator',
        prizeTier: 'STANDARD',
        cashPrizeMin: 10000,
        cashPrizeMax: 100000,
        isActive: true,
        isFeatured: true,
        order: 3
      }
    ];

    for (const cat of sampleCategories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, returnDocument: 'after' });
    }
    logger.info('Award Categories seeded successfully.');

    // 4. Seed Default CMS Data
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

    for (const cmsItem of cmsDefaults) {
      await CMS.findOneAndUpdate({ key: cmsItem.key }, cmsItem, { upsert: true, returnDocument: 'after' });
    }
    logger.info('CMS default content seeded successfully.');

    // 5. Seed Default Settings
    await Settings.findOneAndUpdate({}, { isVotingEnabled: true, isRegistrationOpen: true, isNominationOpen: true }, { upsert: true, returnDocument: 'after' });
    logger.info('Portal settings initialized successfully.');

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

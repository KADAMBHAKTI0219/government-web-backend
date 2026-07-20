const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding database...');

    // Seed Default Admin
    const adminEmail = 'admin@gmail.com';
    let admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      admin = await Admin.create({
        name: 'System Administrator',
        email: adminEmail,
        password: 'password', // Hashed in Admin pre-save hook
        role: 'SUPER_ADMIN',
        active: true
      });
      console.log(`Created default Admin user: ${adminEmail} (password: password)`);
    } else {
      console.log(`Admin user ${adminEmail} already exists.`);
    }

    // Seed Categories with user's new Schema structure
    const sampleCategories = [
      {
        tier: 'A_CULTURE_IDENTITY',
        title: 'Chhattisgarhiya Sanskriti Ambassador',
        shortDescription: 'Celebrating creators showcasing regional heritage, folk music, and local cultural traditions.',
        taskBrief: 'Create an engaging video highlighting traditional art, dance, or folk festivals of the state.',
        hashtag: '#ChhattisgarhiyaSanskriti',
        prizeTier: 'FLAGSHIP',
        cashPrizeMin: 50000,
        cashPrizeMax: 500000,
        submissionWindow: {
          opensAt: new Date(),
          closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
        isActive: true
      },
      {
        tier: 'B_NATION_STATE_BUILDING',
        title: 'Tech & Civic Innovation Pioneer',
        shortDescription: 'Honoring creators bringing awareness to AI, smart governance, and infrastructure development.',
        taskBrief: 'Produce a video demonstrating how digital initiatives improve public services and citizen welfare.',
        hashtag: '#GovTechBuilder',
        prizeTier: 'MARQUEE',
        cashPrizeMin: 25000,
        cashPrizeMax: 300000,
        submissionWindow: {
          opensAt: new Date(),
          closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        isActive: true
      },
      {
        tier: 'C_CRAFT_PLATFORM',
        title: 'Digital Craftsman & Micro-Creator',
        shortDescription: 'Spotlighting emerging nano creators, digital artists, and handicraft storytellers.',
        taskBrief: 'Share a story celebrating local artisan skills, handlooms, or sustainable eco-crafts.',
        hashtag: '#MicroCraftCreator',
        prizeTier: 'STANDARD',
        cashPrizeMin: 10000,
        cashPrizeMax: 100000,
        submissionWindow: {
          opensAt: new Date(),
          closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
        isActive: true
      }
    ];

    for (const cat of sampleCategories) {
      const existing = await Category.findOne({ title: cat.title });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created Category: ${cat.title}`);
      } else {
        console.log(`Category "${cat.title}" already exists.`);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

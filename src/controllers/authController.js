const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkey_creator_awards_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const timestamp = new Date().toISOString();

    console.log(`\n===================================================`);
    console.log(`🔑 ADMIN LOGIN ATTEMPT`);
    console.log(`   Time:  ${timestamp}`);
    console.log(`   Email: ${email || 'N/A'}`);
    console.log(`===================================================`);

    if (!email || !password) {
      console.log(`❌ Login Failed: Missing email or password`);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin user including password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      console.log(`❌ Login Failed: No admin account found with email "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!admin.active) {
      console.log(`❌ Login Failed: Account for "${email}" is deactivated`);
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      console.log(`❌ Login Failed: Password mismatch for email "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(admin._id);

    console.log(`✅ Login SUCCESSFUL`);
    console.log(`   Admin ID: ${admin._id}`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Token:    ${token.substring(0, 30)}...`);
    console.log(`===================================================\n`);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};

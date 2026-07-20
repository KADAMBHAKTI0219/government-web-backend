const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_creator_awards_2026'
      );

      // Find admin by id excluding password
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin || !req.admin.active) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin user disabled or not found'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, missing authentication token'
    });
  }
};

module.exports = { protectAdmin };

import { verifyAccessToken } from '../utils/token.js';
import { ApiResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ApiResponse.error(res, 'Authentication required. Please provide a valid token.', [], 401);
    }

    const decoded = verifyAccessToken(token);
    let user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // Fallback check Admin collection
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return ApiResponse.error(res, 'Account associated with token no longer exists.', [], 401);
    }

    if (user.isActive === false || user.active === false) {
      return ApiResponse.error(res, 'Account has been deactivated. Please contact support.', [], 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Access Token Expired', [{ code: 'TOKEN_EXPIRED' }], 401);
    }
    return ApiResponse.error(res, 'Invalid authentication token', [], 401);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      let user = await User.findById(decoded.id).select('-password');
      if (!user) {
        user = await Admin.findById(decoded.id).select('-password');
      }
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token in optional authentication
  }
  next();
};

import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse.js';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP, please try again after 15 minutes.',
      [],
      429
    );
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // limit login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many authentication attempts. Please wait 15 minutes.',
      [],
      429
    );
  }
});

export const votingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Voting rate limit exceeded. Please wait a moment before voting again.',
      [],
      429
    );
  }
});

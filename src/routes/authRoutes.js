import express from 'express';
import * as AuthController from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', authLimiter, verifyRecaptcha, registerValidator, validateRequest, AuthController.register);
router.post('/login', authLimiter, loginValidator, validateRequest, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validateRequest, AuthController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validateRequest, AuthController.resetPassword);
router.put('/change-password', authenticate, changePasswordValidator, validateRequest, AuthController.changePassword);

export default router;

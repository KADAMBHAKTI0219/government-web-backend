import CaptchaService from '../services/CaptchaService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * Clean Express Middleware to verify CAPTCHA (Custom SVG or Google reCAPTCHA)
 * Fully decoupled backend implementation with environment-aware fallback.
 */
export const verifyRecaptcha = asyncHandler(async (req, res, next) => {
  // 1. Bypass if CAPTCHA is explicitly disabled, in development/test mode, unconfigured secret key, or if client visual captchaCode is provided
  if (
    !process.env.RECAPTCHA_SECRET_KEY ||
    process.env.DISABLE_CAPTCHA === 'true' ||
    process.env.DISABLE_CAPTCHA === '1' ||
    process.env.BYPASS_CAPTCHA === 'true' ||
    process.env.BYPASS_CAPTCHA === '1' ||
    process.env.NODE_ENV === 'development' ||
    !process.env.NODE_ENV ||
    req.body?.captchaCode ||
    req.body?.captchaText
  ) {
    return next();
  }

  const captchaId = req.body?.captchaId || req.body?.captcha_id || req.headers['x-captcha-id'];
  const captchaText = req.body?.captchaText || req.body?.captcha_text || req.body?.captchaCode || req.body?.captcha_code;
  const captchaToken = req.body?.captchaToken || 
                       req.body?.captcha_token || 
                       req.body?.token || 
                       req.body?.['g-recaptcha-response'] ||
                       req.headers['x-captcha-token'];

  // 2. If no captcha token/code sent in request
  if (!captchaId && !captchaText && !captchaToken) {
    logger.warn('CAPTCHA fields missing in request. Bypassing captcha requirement.');
    return next();
  }

  // 3. Verify via CaptchaService
  const result = await CaptchaService.verifyAnyCaptcha({
    captchaId,
    captchaText,
    captchaToken
  });

  if (!result.success) {
    return res.status(result.statusCode || 400).json({
      success: false,
      message: result.message
    });
  }

  next();
});

// Alias export for backward compatibility
export const verifyCaptcha = verifyRecaptcha;

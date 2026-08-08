import express from 'express';
import { generateCaptcha, verifyCaptcha } from '../controllers/CaptchaController.js';

const router = express.Router();

// GET /api/v1/captcha/generate - Generate visual SVG captcha
router.get('/generate', generateCaptcha);

// POST /api/v1/captcha/verify - Verify SVG captcha code or reCAPTCHA token
router.post('/verify', verifyCaptcha);

export default router;

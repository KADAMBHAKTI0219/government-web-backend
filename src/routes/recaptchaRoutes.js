import express from 'express';
import { verifyCaptcha, generateCaptcha } from '../controllers/CaptchaController.js';

const router = express.Router();

router.get('/generate', generateCaptcha);
router.post('/verify', verifyCaptcha);

export default router;

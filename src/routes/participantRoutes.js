import express from 'express';
import * as ParticipantController from '../controllers/ParticipantController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public route: Register participant (protected with reCAPTCHA)
router.post('/register', verifyRecaptcha, ParticipantController.registerParticipant);

// Admin routes: Get all, Get single, Update, Delete
router.get('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.REVIEWER, ROLES.JURY, ROLES.CREATOR), ParticipantController.getParticipants);
router.get('/all', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.REVIEWER, ROLES.JURY, ROLES.CREATOR), ParticipantController.getParticipants);
router.get('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.REVIEWER, ROLES.JURY, ROLES.CREATOR), ParticipantController.getParticipantById);
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.REVIEWER), ParticipantController.updateParticipant);
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), ParticipantController.deleteParticipant);

export default router;

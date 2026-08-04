import express from 'express';
import * as ParticipantController from '../controllers/ParticipantController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public route: Register participant
router.post('/register', ParticipantController.registerParticipant);

// Admin route: Get all participants
router.get('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), ParticipantController.getParticipants);

export default router;

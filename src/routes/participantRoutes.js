import express from 'express';
import { registerParticipant, getParticipants } from '../controllers/participantController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerParticipant);
router.get('/', protectAdmin, getParticipants);

export default router;

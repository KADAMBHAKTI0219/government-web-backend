import express from 'express';
import * as VotingController from '../controllers/VotingController.js';
import { validateRequest } from '../middleware/validator.js';
import { votingLimiter } from '../middleware/rateLimiter.js';
import { voteValidator } from '../validators/votingValidator.js';

const router = express.Router();

// Public vote endpoint with strict rate limiting & anti-spam fingerprinting
router.post('/cast', votingLimiter, voteValidator, validateRequest, VotingController.castVote);
router.get('/analytics', VotingController.getVotingAnalytics);

export default router;

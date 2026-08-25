import express from 'express';
import * as VotingController from '../controllers/VotingController.js';
import { votingLimiter } from '../middleware/rateLimiter.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Public voting endpoints
router.post('/:nominationId/vote', votingLimiter, optionalAuthenticate, VotingController.castVote);
router.post('/cast', votingLimiter, optionalAuthenticate, VotingController.castVote);
router.get('/leaderboard', VotingController.getLeaderboard);
router.get('/analytics', VotingController.getLeaderboard);

export default router;

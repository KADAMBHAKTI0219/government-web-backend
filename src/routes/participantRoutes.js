const express = require('express');
const router = express.Router();
const {
  createParticipant,
  getParticipants,
  getParticipantProfile,
  getParticipantById,
  updateParticipantStatus,
  deleteParticipant
} = require('../controllers/participantController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createParticipant);
router.get('/profile', getParticipantProfile);

// Admin protected routes
router.get('/', protectAdmin, getParticipants);
router.get('/:id', protectAdmin, getParticipantById);
router.put('/:id/status', protectAdmin, updateParticipantStatus);
router.delete('/:id', protectAdmin, deleteParticipant);

module.exports = router;

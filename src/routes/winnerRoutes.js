import express from 'express';
import * as WinnerController from '../controllers/WinnerController.js';

const router = express.Router();

// Public route: Get all winners
router.get('/', WinnerController.getWinners);
router.get('/all', WinnerController.getWinners);

export default router;

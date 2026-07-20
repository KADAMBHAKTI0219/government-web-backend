const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protectAdmin, getDashboardStats);

module.exports = router;

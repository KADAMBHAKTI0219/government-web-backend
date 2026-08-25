import express from 'express';
import * as DashboardController from '../controllers/DashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.REVIEWER, ROLES.MODERATOR), DashboardController.getDashboardStats);
router.get('/admin', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.REVIEWER, ROLES.MODERATOR), DashboardController.getAdminDashboard);
router.get('/jury', authorize(ROLES.JURY, ROLES.SUPER_ADMIN, ROLES.ADMIN), DashboardController.getJuryDashboard);

export default router;

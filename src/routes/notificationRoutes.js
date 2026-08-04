import express from 'express';
import * as NotificationController from '../controllers/NotificationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

router.get('/', NotificationController.getUserNotifications);
router.put('/:id/read', NotificationController.markRead);
router.post('/broadcast', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), NotificationController.broadcastAnnouncement);

export default router;

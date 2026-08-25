import express from 'express';
import * as JuryController from '../controllers/JuryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

// Admin assignment
router.post('/assign', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), JuryController.assignJury);

// Jury endpoints
router.get('/assigned', authorize(ROLES.JURY, ROLES.SUPER_ADMIN, ROLES.ADMIN), JuryController.getAssignedNominations);
router.post('/review/:id', authorize(ROLES.JURY, ROLES.SUPER_ADMIN, ROLES.ADMIN), JuryController.reviewNomination);
router.post('/score/:applicationId', authorize(ROLES.JURY, ROLES.SUPER_ADMIN, ROLES.ADMIN), JuryController.reviewNomination);

export default router;

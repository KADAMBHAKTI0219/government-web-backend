import express from 'express';
import * as JuryController from '../controllers/JuryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { assignJuryValidator, scoreApplicationValidator } from '../validators/juryValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

// Admin assign route
router.post('/assign', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), assignJuryValidator, validateRequest, JuryController.assignJury);

// Jury dashboard & evaluation routes
router.get('/assigned', authorize(ROLES.JURY, ROLES.SUPER_ADMIN, ROLES.ADMIN), JuryController.getAssignedApplications);
router.post('/score/:applicationId', authorize(ROLES.JURY), scoreApplicationValidator, validateRequest, JuryController.scoreApplication);
router.get('/leaderboard', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.JURY, ROLES.MODERATOR), JuryController.getLeaderboard);

export default router;

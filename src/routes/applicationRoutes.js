import express from 'express';
import * as ApplicationController from '../controllers/ApplicationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { upload } from '../middleware/upload.js';
import { createApplicationValidator, updateApplicationStatusValidator } from '../validators/applicationValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

// Creator routes
router.post('/', authorize(ROLES.CREATOR), createApplicationValidator, validateRequest, ApplicationController.createApplication);
router.post('/:id/submit', authorize(ROLES.CREATOR), ApplicationController.submitApplication);
router.put('/:id/draft', authorize(ROLES.CREATOR), ApplicationController.updateDraft);
router.delete('/:id/draft', authorize(ROLES.CREATOR), ApplicationController.deleteDraft);
router.post('/:id/upload', authorize(ROLES.CREATOR), upload.single('file'), ApplicationController.uploadMedia);

// Admin & Jury read routes
router.get('/', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.JURY, ROLES.CREATOR), ApplicationController.getApplications);
router.get('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.JURY, ROLES.CREATOR), ApplicationController.getApplicationById);

// Admin status transition route
router.put('/:id/status', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), updateApplicationStatusValidator, validateRequest, ApplicationController.updateStatus);

export default router;

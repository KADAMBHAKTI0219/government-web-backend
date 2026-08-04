import express from 'express';
import * as CMSController from '../controllers/CMSController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { cmsValidator } from '../validators/cmsValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public read routes
router.get('/all', CMSController.getAllCMS);
router.get('/:key', CMSController.getCMSSection);

// Admin update routes
router.put('/:key', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), cmsValidator, validateRequest, CMSController.updateCMSSection);

export default router;

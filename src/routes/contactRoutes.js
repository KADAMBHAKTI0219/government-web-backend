import express from 'express';
import * as ContactController from '../controllers/ContactController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { contactValidator } from '../validators/contactValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public submission route
router.post('/submit', contactValidator, validateRequest, ContactController.submitQuery);

// Admin management routes
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR));

router.get('/all', ContactController.getAllQueries);
router.put('/:id/resolve', ContactController.resolveQuery);

export default router;

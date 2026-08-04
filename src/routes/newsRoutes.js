import express from 'express';
import * as NewsController from '../controllers/NewsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { newsValidator } from '../validators/newsValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public routes
router.get('/', NewsController.getAllNews);
router.get('/:slug', NewsController.getNewsBySlug);

// Admin routes
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR));

router.post('/', newsValidator, validateRequest, NewsController.createNews);
router.put('/:id', newsValidator, validateRequest, NewsController.updateNews);
router.delete('/:id', NewsController.deleteNews);

export default router;

import express from 'express';
import * as CategoryController from '../controllers/CategoryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { createCategoryValidator, updateCategoryValidator } from '../validators/categoryValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

// Admin protected CRUD routes
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.post('/', createCategoryValidator, validateRequest, CategoryController.createCategory);
router.put('/:id', updateCategoryValidator, validateRequest, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;

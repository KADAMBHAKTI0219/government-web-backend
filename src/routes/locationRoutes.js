import express from 'express';
import * as LocationController from '../controllers/LocationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public route: Get all active states with nested cities array (For Participate/Categories dropdowns)
router.get('/', LocationController.getPublicLocations);

// Admin routes: Manage States & Cities
router.get('/admin', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), LocationController.getAllLocationsAdmin);
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.createState);
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.updateState);
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.deleteState);

// Admin routes for nested Cities array inside a State
router.post('/:id/cities', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.addCityToState);
router.delete('/:id/cities/:cityId', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.deleteCityFromState);

// Seed route
router.post('/seed', LocationController.seedDefaultLocations);

export default router;

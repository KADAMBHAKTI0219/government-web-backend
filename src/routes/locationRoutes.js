import express from 'express';
import * as LocationController from '../controllers/LocationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public routes (Static sub-paths placed before parametric routes)
router.get('/', LocationController.getPublicLocations);
router.get('/public', LocationController.getPublicLocations);
router.get('/states', LocationController.getStates);
router.get('/cities', LocationController.getCitiesOrDistricts);
router.get('/districts', LocationController.getCitiesOrDistricts);
router.get('/chhattisgarh', LocationController.getChhattisgarhLocations);

// Admin search & listing (Static path before parametric routes)
router.get('/admin', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), LocationController.getAllLocationsAdmin);

// Seed route
router.post('/seed', LocationController.seedDefaultLocations);

// Admin state management
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.createState);
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.updateState);
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.deleteState);

// Admin nested cities/districts management
router.post('/:id/cities', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.addCityToState);
router.delete('/:id/cities/:cityId', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), LocationController.deleteCityFromState);

// Public state location lookup by ObjectId, State Name, or State Code
router.get('/:idOrName', LocationController.getLocationByIdOrName);

export default router;


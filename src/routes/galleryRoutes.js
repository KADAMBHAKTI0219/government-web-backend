import express from 'express';
import * as GalleryController from '../controllers/GalleryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { galleryValidator } from '../validators/galleryValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public routes
router.get('/', GalleryController.getAlbums);
router.get('/:slug', GalleryController.getAlbumBySlug);

// Admin routes
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR));

router.post('/', galleryValidator, validateRequest, GalleryController.createAlbum);
router.post('/:id/media', GalleryController.addMediaToAlbum);
router.delete('/:id', GalleryController.deleteAlbum);

export default router;

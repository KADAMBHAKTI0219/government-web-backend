import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { upload } from '../middleware/upload.js';
import { updateProfileValidator } from '../validators/creatorValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);

router.get('/profile', UserController.getProfile);
router.put('/profile', updateProfileValidator, validateRequest, UserController.updateProfile);
router.post('/profile-image', uploadFields, UserController.uploadProfileImage);
router.post('/upload-avatar', uploadFields, UserController.uploadProfileImage);
router.post('/profile-picture', uploadFields, UserController.uploadProfileImage);
router.delete('/account', UserController.deleteAccount);

// Admin only routes
router.get('/all', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), UserController.getAllUsers);
router.get('/', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR), UserController.getAllUsers);

export default router;

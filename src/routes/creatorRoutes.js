import express from 'express';
import * as CreatorController from '../controllers/CreatorController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validateRequest } from '../middleware/validator.js';
import { upload } from '../middleware/upload.js';
import { socialLinksValidator } from '../validators/creatorValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, authorize(ROLES.CREATOR, ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/dashboard', CreatorController.getCreatorDashboard);
router.put('/social-links', socialLinksValidator, validateRequest, CreatorController.updateSocialLinks);
router.put('/achievements', CreatorController.updateAchievements);
router.post('/portfolio', upload.single('portfolio'), CreatorController.uploadPortfolio);

export default router;

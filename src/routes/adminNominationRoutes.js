import express from 'express';
import * as AdminNominationController from '../controllers/AdminNominationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.REVIEWER, ROLES.MODERATOR));

// Admin Listing & Filtering
router.get('/', AdminNominationController.getNominations);
router.get('/:id', AdminNominationController.getNominationById);

// 3-Tier Verification & Evaluation Endpoints
router.post('/:id/eligibility', AdminNominationController.eligibilityReview);
router.post('/:id/preliminary', AdminNominationController.preliminaryAssessment);
router.post('/:id/shortlist', AdminNominationController.shortlistNomination);
router.post('/:id/tier1', AdminNominationController.submitTier1Review);
router.post('/:id/tier2', AdminNominationController.submitTier2Review);
router.post('/:id/tier3', AdminNominationController.submitTier3Review);
router.post('/:id/compliance', AdminNominationController.submitComplianceReview);

// Jury Assignment & Winner Declaration
router.post('/:id/jury-assign', AdminNominationController.assignJury);
router.post('/:id/winner', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), AdminNominationController.declareWinner);

export default router;

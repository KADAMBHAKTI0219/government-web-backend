import express from 'express';
import * as NominationController from '../controllers/NominationController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';

const router = express.Router();

// Public Nomination & Draft routes with reCAPTCHA verification
router.post('/', verifyRecaptcha, optionalAuthenticate, NominationController.createNomination);
router.post('/draft', verifyRecaptcha, optionalAuthenticate, NominationController.saveDraft);
router.put('/:id/draft', verifyRecaptcha, optionalAuthenticate, NominationController.updateDraft);
router.get('/my-drafts', authenticate, NominationController.getMyDrafts);

// Application Submission with reCAPTCHA
router.post('/:id/submit', verifyRecaptcha, optionalAuthenticate, NominationController.submitNomination);

// Application Tracking
router.get('/track/:applicationId', NominationController.trackApplication);

export default router;

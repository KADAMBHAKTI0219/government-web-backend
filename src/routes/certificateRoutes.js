import express from 'express';
import * as CertificateController from '../controllers/CertificateController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public QR verification endpoint
router.get('/verify', CertificateController.verifyCertificate);

// Protected routes
router.use(authenticate);

router.get('/my-certificates', authorize(ROLES.CREATOR, ROLES.SUPER_ADMIN, ROLES.ADMIN), CertificateController.getMyCertificates);
router.post('/generate', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), CertificateController.generateCertificate);

export default router;

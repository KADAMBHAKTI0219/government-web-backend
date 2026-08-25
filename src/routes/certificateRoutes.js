import express from 'express';
import * as CertificateController from '../controllers/CertificateController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public Verification & Download Endpoints
router.get('/verify/:certificateId', CertificateController.verifyCertificate);
router.get('/verify', CertificateController.verifyCertificate);
router.get('/:id/download', CertificateController.downloadCertificate);
router.get('/:id', CertificateController.getCertificateById);

// Admin Certificate Generation
router.post('/generate', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), CertificateController.generateCertificate);

export default router;

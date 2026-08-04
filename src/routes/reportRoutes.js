import express from 'express';
import * as ReportController from '../controllers/ReportController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/applications/excel', ReportController.exportApplicationsExcel);
router.get('/applications/csv', ReportController.exportApplicationsCSV);

export default router;

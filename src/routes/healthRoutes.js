import express from 'express';
import * as HealthController from '../controllers/healthController.js';

const router = express.Router();

router.get('/', HealthController.getHealth);
router.get('/ping', HealthController.ping);
router.get('/db', HealthController.getDbHealth);

export default router;

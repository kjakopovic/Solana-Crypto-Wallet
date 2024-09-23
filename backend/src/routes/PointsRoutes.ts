// src/routes/PointsRoutes.ts

import { Router } from 'express';
import PointsController from '../controllers/PointsController';

const router = Router();

router.post('/save', PointsController.savePoints);

export default router;
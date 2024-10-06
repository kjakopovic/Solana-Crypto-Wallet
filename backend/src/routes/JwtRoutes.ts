// src/routes/JwtRoutes.ts

import { Router } from 'express';
import JwtController from '../controllers/JwtController';

const router = Router();

router.post('/verify-refresh', JwtController.verifyRefreshTokenController);

export default router;
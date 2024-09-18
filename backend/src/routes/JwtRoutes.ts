// src/routes/JwtRoutes.ts

import { Router } from 'express';
import{
    refreshAccessTokenController,
    createRefreshTokenController,
    verifyAccessTokenController,
    verifyRefreshTokenController
} from '../controllers/JwtController';

const router = Router();

router.post('/refresh-access', refreshAccessTokenController);
router.post('/create-refresh', createRefreshTokenController);
router.post('/verify-access', verifyAccessTokenController);
router.post('/verify-refresh', verifyRefreshTokenController);

export default router;
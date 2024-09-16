// src/routes/JwtRoutes.ts

import { Router } from 'express';
import{
    refreshAccessTokenController,
    createRefreshTokenController,
    verifyAccessTokenController
} from '../controllers/JwtController';

const router = Router();

router.post('/refresh-access', refreshAccessTokenController);
router.post('/create-refresh', createRefreshTokenController);
router.post('/verify-access', verifyAccessTokenController);

export default router;
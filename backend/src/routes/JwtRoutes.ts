// src/routes/JwtRoutes.ts

import { Router } from 'express';
import {
    refreshAccessTokenController,
    createRefreshTokenController,
    verifyAccessTokenController,
    verifyRefreshTokenController
} from '../controllers/JwtController';

const router = Router();

/**
 * @swagger
 * /jwt/refresh-access:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Error refreshing access token
 */
router.post('/refresh-access', refreshAccessTokenController);

/**
 * @swagger
 * /jwt/create-refresh:
 *   post:
 *     summary: Create refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refresh token created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating refresh token
 */
router.post('/create-refresh', createRefreshTokenController);

/**
 * @swagger
 * /jwt/verify-access:
 *   post:
 *     summary: Verify access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token verified successfully
 *       401:
 *         description: Invalid input
 *       403:
 *         description: Invalid access token
 *       500:
 *         description: Error verifying access token
 */
router.post('/verify-access', verifyAccessTokenController);

/**
 * @swagger
 * /jwt/verify-refresh:
 *   post:
 *     summary: Verify refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refresh token verified successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Error verifying refresh token
 */
router.post('/verify-refresh', verifyRefreshTokenController);

export default router;
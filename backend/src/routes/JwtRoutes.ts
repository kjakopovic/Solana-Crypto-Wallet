// src/routes/JwtRoutes.ts

import { Router } from 'express';
import JwtController from '../controllers/JwtController';

const router = Router();

// TODO: Implement middleware to check if the user is logged in
// TODO: Implement CORS allowed origin on all routes
/**
 * @swagger
 * /api/v1/jwt/refresh-access:
 *   post:
 *     summary: Refresh access token
 *     description: Generate access token by providing the refresh token
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
router.post('/refresh-access', JwtController.refreshAccessTokenController);

export default router;
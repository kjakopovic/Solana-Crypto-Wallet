// src/routes/NFTRoutes.ts

import { Router } from 'express';
import NFTController from '../controllers/NFTController';

const router = Router();

/**
 * @swagger
 * /api/v1/nft/welcome:
 *   get:
 *     summary: Get welcome NFT
 *     description: Get the welcome NFT
 *     responses:
 *       200:
 *         description: Welcome NFT retrieved successfully
 *       500:
 *         description: Error getting welcome NFT
 */
router.get('/welcome', NFTController.getWelcomeNFT);

export default router;
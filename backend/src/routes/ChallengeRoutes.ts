// src/routes/ChallengeRoutes.ts

import { Router } from 'express';
import ChallengeController from "../controllers/ChallengeController";
import authMiddleware from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/challenges/get-all:
 *   get:
 *     summary: Get all challenges
 *     description: Get all challenges available
 *     responses:
 *       200:
 *         description: Challenges retrieved successfully
 *       500:
 *         description: Error getting challenges
 */
router.post('/get-all', authMiddleware, ChallengeController.getAllChallenges);

export default router;
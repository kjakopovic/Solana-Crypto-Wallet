// src/routes/ChallengeRoutes.ts

import { Router } from 'express';
import ChallengeController from "../controllers/ChallengeController";

const router = Router();

/**
 * @swagger
 * /challenges/get-all:
 *   get:
 *     summary: Get all challenges
 *     description: Get all challenges available
 *     responses:
 *       200:
 *         description: Challenges retrieved successfully
 *       500:
 *         description: Error getting challenges
 */
router.get('/get-all', ChallengeController.getAllChallenges);

export default router;
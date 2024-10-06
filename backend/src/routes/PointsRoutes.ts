// src/routes/PointsRoutes.ts

import { Router } from 'express';
import PointsController from '../controllers/PointsController';
import authMiddleware from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/points/save:
 *   post:
 *     summary: Save user points
 *     description: Save user points from challenge or daily quiz. It must always contain publicKey.
 *          If from challenge, the request body must contain the publicKey and challengeId fields.
 *          If from daily quiz, the request body must contain the publicKey and quizDifficulty fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *                 required: true
 *               challengeId:
 *                  type: string
 *                  required: false
 *               quizDifficulty:
 *                  type: string
 *                  required: false
 *     responses:
 *       200:
 *          description: Points saved successfully
 *       400:
 *          description: Invalid input
 *       404:
 *          description: User not found
 *       500:
 *          description: Error saving points
 */
router.post('/save', authMiddleware, PointsController.savePoints);

export default router;
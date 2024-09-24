// src/routes/QuizRoutes.ts

import { Router } from 'express';
import QuizController from '../controllers/QuizController';

const router = Router();

/**
 * @swagger
 * /quiz/random:
 *   post:
 *     summary: Get a random quiz question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *     responses:
 *       200:
 *         description: Random quiz question retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: No quiz found
 *       500:
 *          description: Error getting random quiz
 */
router.get('/get', QuizController.getRandomQuiz);

export default router;
// src/routes/QuizRoutes.ts

import { Router } from 'express';
import QuizController from '../controllers/QuizController';

const router = Router();

// TODO: If set as GET, Swagger UI will not work
/**
 * @swagger
 * /quiz/get:
 *   post:
 *     summary: Get a random quiz question
 *     description: Get a random quiz question based on the difficulty level provided.
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
router.post('/get', QuizController.getRandomQuiz);

export default router;
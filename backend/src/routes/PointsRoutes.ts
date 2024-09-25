// src/routes/PointsRoutes.ts

import { Router } from 'express';
import PointsController from '../controllers/PointsController';

const router = Router();

// TODO: Change this endpoint so it works differently, do not send the points at all, use table and json msgs to assign points to a user
/**
 * @swagger
 * /points/save:
 *   post:
 *     summary: Save user points
 *     description: Save user points from challenge or daily quiz. It must always contain publicKey and points fields.
 *          If from challenge, the request body must contain the publicKey, points and fromChallenge fields.
 *          If from daily quiz, the request body must contain the publicKey, points, fromDailyQuiz and questionId fields.
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
 *               points:
 *                 type: number
 *                 required: true
 *               fromChallenge:
 *                  type: boolean
 *               fromDailyQuiz:
 *                  type: boolean
 *               questionId:
 *                  type: integer
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
router.post('/save', PointsController.savePoints);

export default router;
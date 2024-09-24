// src/routes/PointsRoutes.ts

import { Router } from 'express';
import PointsController from '../controllers/PointsController';

const router = Router();


/**
 * @swagger
 * /points/save:
 *   post:
 *     summary: Save user points
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               points:
 *                 type: number
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
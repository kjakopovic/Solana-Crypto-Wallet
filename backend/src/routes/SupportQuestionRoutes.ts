// src/routes/SupportQuestionRoutes.ts

import { Router } from 'express';
import SupportQuestionController from '../controllers/SupportQuestionController';
import authMiddleware from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/support-question/create:
 *   post:
 *     summary: Create a new support question
 *     description: Create a new support question. It must contain publicKey and question.
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
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                  type: string
 *                  required: true
 *     responses:
 *       201:
 *         description: Support question created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating support question
 */
router.post('/create', authMiddleware, SupportQuestionController.createSupportQuestion);

/**
 * @swagger
 * /api/v1/support-question/answer:
 *   post:
 *     summary: Answer a support question
 *     description: Answer a support question. It must contain questionId and answer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 required: true
 *               answer:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Support question answered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error answering support question
 */
router.post('/answer', authMiddleware, SupportQuestionController.answerSupportQuestion);

/**
 * @swagger
 * /api/v1/support-question/fetch-sq-by-field:
 *   get:
 *     summary: Fetch a support question by field
 *     description: Fetch a support question by field. It must contain field and value.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 required: true
 *               value:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Support question fetched successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error fetching support question
 */
router.get('/fetch-sq-by-field', authMiddleware, SupportQuestionController.fetchSupportQuestionByField);

/**
 * @swagger
 * /api/v1/support-question/fetch-all-sq:
 *   get:
 *     summary: Fetch all support questions
 *     description: Fetch all support questions
 *     responses:
 *       200:
 *         description: Support questions fetched successfully
 *       500:
 *         description: Error fetching support questions
 */
router.get('/fetch-all-sq', authMiddleware, SupportQuestionController.fetchAllSupportQuestions);

/**
 * @swagger
 * /api/v1/support-question/fetch-answered-sq:
 *   get:
 *     summary: Fetch answered support questions
 *     description: Fetch answered support questions
 *     responses:
 *       200:
 *         description: Answered support questions fetched successfully
 *       500:
 *         description: Error fetching answered support questions
 */
router.get('/fetch-answered-sq', authMiddleware, SupportQuestionController.fetchAnsweredSupportQuestions);

export default router;
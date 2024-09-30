// src/routes/SupportQuestionRoutes.ts

import { Router } from 'express';
import SupportQuestionController from '../controllers/SupportQuestionController';
import authMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post('/create', authMiddleware, SupportQuestionController.createSupportQuestion);

router.post('/answer', authMiddleware, SupportQuestionController.answerSupportQuestion);

router.get('/fetch-sq-by-field', authMiddleware, SupportQuestionController.fetchSupportQuestionByField);

router.get('/fetch-all-sq', authMiddleware, SupportQuestionController.fetchAllSupportQuestions);

export default router;

// src/routes/QuizRoutes.ts

import { Router } from 'express';
import QuizController from '../controllers/QuizController';

const router = Router();

router.get('/daily', QuizController.getDailyQuiz);
router.post('/submit', QuizController.submitQuizAnswer);

export default router;
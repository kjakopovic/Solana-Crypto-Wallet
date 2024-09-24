// src/routes/QuizRoutes.ts

import { Router } from 'express';
import QuizController from '../controllers/QuizController';

const router = Router();

router.get('/get', QuizController.getRandomQuiz);

export default router;
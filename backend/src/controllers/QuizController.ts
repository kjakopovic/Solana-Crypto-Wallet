// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserService from "../services/UserService";
import QuizService from '../services/QuizService';
import logger from '../config/Logger';

const className = 'QuizController';

class QuizController {

    async getDailyQuiz(res: Response): Promise<Response> {
        logger.info('Getting daily quiz', { className });

        try {
            const quiz = await QuizService.getDailyQuizQuestion();
            logger.info('Daily quiz found', { className });
            return res.status(200).json(quiz);
        } catch (error) {
            logger.error('Error getting daily quiz', { error, className });
            return res.status(500).json({ message: 'Error getting daily quiz: ' + error });
        }
    }


}

export default new QuizController;
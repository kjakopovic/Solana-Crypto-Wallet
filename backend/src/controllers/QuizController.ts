// src/controllers/UserController.ts

import { Request, Response } from 'express';
import QuizService from '../services/QuizService';
import logger from '../config/Logger';

const className = 'QuizController';

class QuizController {

    async getRandomQuiz(req: Request, res: Response): Promise<Response> {
        logger.info('Getting daily quiz', { className });
        let { difficulty } = req.body.difficulty;

        if (!difficulty) {
            logger.error('No difficulty provided', { className });
            return res.status(400).json({ message: 'No difficulty provided' });
        }

        difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

        if (difficulty !== 'Easy' && difficulty !== 'Medium' && difficulty !== 'Hard') {
            logger.error('Invalid difficulty provided', { className });
            return res.status(400).json({ message: 'Invalid difficulty provided' });
        }

        try {
            const quiz = await QuizService.getRandomQuiz(difficulty);

            if (!quiz) {
                logger.error('No quiz found', { className });
                return res.status(404).json({ message: 'No quiz found' });
            }

            logger.info('Returning quiz in json!', { className });
            return res.status(200).json(quiz);
        } catch (error) {
            logger.error('Error getting daily quiz', { error, className });
            return res.status(500).json({ message: 'Error getting daily quiz: ' + error });
        }
    }

}

export default new QuizController;
// src/services/QuizService.ts

import logger from '../config/Logger';
import QuizModel from "../models/QuizModel";
import UserModel from "../models/UserModel";

const className = 'QuizService';

class QuizService {

    public async getRandomQuiz(difficulty: string) {
        logger.info('Getting daily quiz', { className });

        try {
            const quiz = await QuizModel.fetchQuizByDifficulty(difficulty);
            logger.info('Random quiz fetched successfully!', { className });
            return quiz;
        } catch (err) {
            logger.error('Error getting daily quiz: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new QuizService;
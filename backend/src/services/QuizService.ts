// src/services/QuizService.ts

import logger from '../config/Logger';
import { QuizModel } from "../models/QuizModel";

const className = 'QuizService';

class QuizService {
    private quizModel: QuizModel;

    constructor() {
        this.quizModel = new QuizModel();
    }

    private generateRandomNumber(): number {
        return Math.floor(Math.random() * (10 - 1 + 1) + 1);
    }

    public async getDailyQuizQuestion() {
        logger.info('Getting daily quiz', { className });

        try {
            const question = this.generateRandomNumber();
            const quiz = await this.quizModel.getDailyQuizQuestionId(question);
            logger.info('Daily quiz found, returning quiz', { className });
            return quiz;
        } catch (err) {
            logger.error('Error getting daily quiz: ' + err, { error: err, className });
            throw err;
        }
    }
}

export default new QuizService;
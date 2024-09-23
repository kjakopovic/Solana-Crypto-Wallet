// src/services/QuizService.ts

import logger from '../config/Logger';
import QuizModel from "../models/QuizModel";
import UserModel from "../models/UserModel";

const className = 'QuizService';

class QuizService {

    private generateRandomNumber(): number {
        return Math.floor(Math.random() * (10 - 1 + 1) + 1);
    }

    public async getDailyQuizQuestion() {
        logger.info('Getting daily quiz', { className });

        try {
            const question = this.generateRandomNumber();
            const quiz = await QuizModel.getDailyQuizQuestionId(question);
            logger.info('Daily quiz found, returning quiz', { className });
            return quiz;
        } catch (err) {
            logger.error('Error getting daily quiz: ' + err, { error: err, className });
            throw err;
        }
    }

    public async submitQuizAnswer(userId: string, questionId: number, answer: string) {
        logger.info('Submitting quiz answer for user: ' + userId, { className });
        logger.info('Question ID: ' + questionId, { className });

        try{
            const quiz = await QuizModel.getQuizQuestionById(questionId);
            const correctAnswer = await QuizModel.getCorrectAnswer(questionId);

            if (!quiz) {
                logger.error('Quiz question not found', { className });
                return null;
            }

            let points = 0;
            const isCorrect = correctAnswer === answer;
            if (isCorrect) {
                logger.info('Correct answer submitted', { className });
                switch (quiz.difficulty.toLowerCase()) {
                    case 'easy':
                        points = 1;
                        break;
                    case 'medium':
                        points = 2;
                        break;
                    case 'hard':
                        points = 3;
                        break;
                }
            }

            await UserModel.updateUserPoints(userId, points);
            logger.info('Quiz answer submitted successfully', { className });
            return { correct: isCorrect, points };
        }catch (err) {
            logger.error('Error submitting quiz answer: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new QuizService;
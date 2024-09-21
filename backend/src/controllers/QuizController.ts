// src/controllers/UserController.ts

import { Request, Response } from 'express';
import QuizService from '../services/QuizService';
import logger from '../config/Logger';
import QuizModel from '../models/QuizModel';
import UserModel from "../models/UserModel";

const className = 'QuizController';

class QuizController {

    async getDailyQuiz(req: Request, res: Response): Promise<Response> {
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

    async submitQuizAnswer(req: Request, res: Response): Promise<Response> {
        logger.info('Submitting quiz answer', {className});
        const user = await UserModel.findUserByField('publicKey', req.body.publicKey);

        if(!user){
            logger.error('User not found', {className});
            return res.status(404).json({message: 'User not found'});
        }
        try{
            const userId = user.id;
            const result = await QuizService.submitQuizAnswer(userId, req.body.questionId, req.body.answer);
            return res.status(200).json(result);
        }catch(error){
            logger.error('Error submitting quiz answer: ' + error, {error, className});
            return res.status(500).json({message: 'Error submitting quiz answer: ' + error});
        }

    }

}

export default new QuizController;
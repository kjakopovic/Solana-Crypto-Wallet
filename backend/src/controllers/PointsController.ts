// src/controllers/PointsController.ts

import { Request, Response } from 'express';
import PointsService from '../services/PointsService';
import logger from '../config/Logger';
import UserService from "../services/UserService";

const className = 'PointsController';

class PointsController{

    async savePoints(req: Request, res: Response): Promise<Response> {
        logger.info('Saving points', { className });
        const publicKey = req.body.publicKey;

        if(!publicKey){
            logger.error('Invalid request, missing publicKey', { className });
            return res.status(400).json({ message: 'Invalid request, missing publicKey' });
        }

        const user = await UserService.findUserByField('publicKey', publicKey);
        if(!user){
            logger.error('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }

        if(req.body.challengeId && !req.body.quizDifficulty){
            try{
                logger.info('Saving points from challenge', { className });
                await PointsService.savePointsChallenge(user.id, req.body.challengeId);
                return res.status(200).json({ message: 'Points saved successfully' });
            }catch(err){
                logger.error('Error saving points: ' + err, { error: err, className });
                return res.status(500).json({ message: 'Error saving points: ' + err });
            }
        }else if(!req.body.challengeId && req.body.quizDifficulty){
            try{
                logger.info('Saving points from daily quiz', { className });
                await PointsService.savePointsQuiz(user.id, req.body.quizDifficulty);
                return res.status(200).json({ message: 'Points saved successfully' });
            }catch(err){
                logger.error('Error saving points: ' + err, { error: err, className });
                return res.status(500).json({ message: 'Error saving points: ' + err });
            }
        }
        else{
            logger.error('Invalid request', { className });
            return res.status(400).json({ message: 'Invalid request' });
        }
    }
}

export default new PointsController();
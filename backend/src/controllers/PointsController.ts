// src/controllers/PointsController.ts

import { Request, Response } from 'express';
import PointsService from '../services/PointsService';
import logger from '../config/Logger';
import UserModel from '../models/UserModel';

const className = 'PointsController';

class PointsController{

    async savePoints(req: Request, res: Response): Promise<Response> {
        logger.info('Saving points', { className });
        const publicKey = req.body.publicKey;
        const points = req.body.points;

        if(!publicKey || !points){
            logger.error('Invalid request', { className });
            return res.status(400).json({ message: 'Invalid request' });
        }

        const user = await UserModel.findUserByField('publicKey', publicKey);
        if(!user){
            logger.error('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }

        if(req.body.fromChallenge){
            try{
                logger.info('Saving points from challenge', { className });
                await PointsService.savePointsChallenge(user.id, points);
                return res.status(200).json({ message: 'Points saved successfully' });
            }catch(err){
                logger.error('Error saving points: ' + err, { error: err, className });
                return res.status(500).json({ message: 'Error saving points: ' + err });
            }
        }else if(req.body.fromDailyQuiz){
            try{
                logger.info('Saving points from daily quiz', { className });
                await PointsService.savePointsQuiz(user.id, points, req.body.questionId);
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
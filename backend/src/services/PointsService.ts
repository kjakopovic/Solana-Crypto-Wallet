// src/services/PointsService.ts

import PointsModel from '../models/PointsModel';
import logger from '../config/Logger';
import UserService from './UserService';
import ChallengeModel from '../models/ChallengeModel';

const className = 'PointsService';

class PointsService{

    public async savePointsChallenge(userId: string, challengeId: number): Promise<void> {
        logger.info(`Saving points for user: ` + userId, { className });

        if(!userId || !challengeId){
            logger.error('Invalid request, missing userId or challengeId', { className });
            throw new Error('Invalid request, missing userId or challengeId');
        }

        const points = await ChallengeModel.fetchPointsForChallenge(challengeId);
        if(!points){
            logger.error('Challenge not found', { className });
            throw new Error('Challenge not found');
        }

        try {
            await PointsModel.savePointsChallenge(userId, challengeId, points);
            await UserService.updateUserPoints(userId, points);
            logger.info('Points saved successfully', { className });
        } catch (err) {
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

    public async savePointsQuiz(userId: string, quizDifficulty: string): Promise<void> {
        logger.info(`Saving points for user: ` + userId, { className });

        if(!userId || !quizDifficulty){
            logger.error('Invalid request, missing userId or quizDifficulty', { className });
            throw new Error('Invalid request, missing userId or quizDifficulty');
        }

        const difficulty = quizDifficulty.charAt(0).toUpperCase() + quizDifficulty.slice(1).toLowerCase();

        if(!['Easy', 'Medium', 'Hard'].includes(difficulty)){
            logger.error('Invalid quiz difficulty', { className });
            throw new Error('Invalid quiz difficulty');
        }

        try {
            switch(difficulty){
                case 'Easy':
                    await PointsModel.savePointsQuiz(userId, 'Easy', 1);
                    await UserService.updateUserPoints(userId, 1);
                    break;
                case 'Medium':
                    await PointsModel.savePointsQuiz(userId, 'Medium', 2);
                    await UserService.updateUserPoints(userId, 2);
                    break;
                case 'Hard':
                    await PointsModel.savePointsQuiz(userId, 'Hard',3);
                    await UserService.updateUserPoints(userId, 3);
                    break;
            }

            logger.info('Points saved successfully', { className });
        } catch (err) {
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new PointsService();
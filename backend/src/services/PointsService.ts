// src/services/PointsService.ts

import PointsModel from '../models/PointsModel';
import logger from '../config/Logger';

const className = 'PointsService';

class PointsService{

    public async savePointsChallenge(userId: string, points: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });

        try {
            await PointsModel.savePointsChallenge(userId, points);
        } catch (err) {
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

    public async savePointsQuiz(userId: string, points: number, questionId: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });

        try {
            await PointsModel.savePointsQuiz(userId, points, questionId);
        } catch (err) {
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new PointsService();
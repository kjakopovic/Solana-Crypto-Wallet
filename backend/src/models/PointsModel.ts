// src/models/PointsModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'PointsModel';

class PointsModel {
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    public async savePointsChallenge(userId: string, points: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });
        const sqlQuery = `
            INSERT INTO points (userId, points, fromChallenge, fromDailyQuiz, questionId)
            VALUES (@userId, @points, @fromChallenge, @fromDailyQuiz, @questionId);
        `;

        try{
            await this.db.request()
                .input('userId', userId)
                .input('points', points)
                .input('fromChallenge', 1)
                .input('fromDailyQuiz', 0)
                .input('questionId', null)
                .query(sqlQuery);

            logger.info('Points saved successfully', { className });
            console.log(`Points saved successfully for user: ${userId}`);

        }catch(err){
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

    public async savePointsQuiz(userId: string, points:number, questionId: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });
        const sqlQuery = `
            INSERT INTO points (userId, points, fromChallenge, fromDailyQuiz, questionId)
            VALUES (@userId, @points, @fromChallenge, @fromDailyQuiz, @questionId);
        `;

        try {
            await this.db.request()
                .input('userId', userId)
                .input('points', points)
                .input('fromChallenge', 0)
                .input('fromDailyQuiz', 1)
                .input('questionId', questionId)
                .query(sqlQuery);

            logger.info('Points saved successfully', {className});
            console.log(`Points saved successfully for user: ${userId}`);
        }catch(err){
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new PointsModel();
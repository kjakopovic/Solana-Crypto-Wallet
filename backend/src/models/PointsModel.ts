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

    public async savePointsChallenge(userId: string, challengeId: number, points: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });
        const sqlQuery = `
            INSERT INTO points (userId, challengeId, points)
            VALUES (@userId, @challengeId, @points);
        `;

        try{
            await this.db.request()
                .input('userId', userId)
                .input('challengeId', challengeId)
                .input('points', points)
                .query(sqlQuery);

            logger.info('Points saved successfully', { className });
            console.log(`Points saved successfully for user: ${userId}`);

        }catch(err){
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

    public async savePointsQuiz(userId: string, quizDifficulty: string, points: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });
        const sqlQuery = `
            INSERT INTO points (userId, quizDifficulty, points)
            VALUES (@userId, @quizDifficulty, @points);
        `;

        try {
            await this.db.request()
                .input('userId', userId)
                .input('quizDifficulty', quizDifficulty)
                .input('points', points)
                .query(sqlQuery);

            logger.info('Points saved successfully', {className});
            console.log(`Points saved successfully for user: ${userId}`);
        }catch(err){
            logger.error('Error saving points: ' + err, { error: err, className });
            throw err;
        }
    }

    public async findPointsByUserIdAndChallengeId(userId: string, challengeId: number): Promise<any> {
        logger.info('Finding points by userId and challengeId', { className });
        const sqlQuery = `
            SELECT * FROM points
            WHERE userId = @userId AND challengeId = @challengeId;
        `;

        try {
            const result = await this.db.request()
                .input('userId', userId)
                .input('challengeId', challengeId)
                .query(sqlQuery);

            logger.info('Points found', { className });
            return result.recordset[0];
        } catch (err) {
            logger.error('Error finding points: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new PointsModel();
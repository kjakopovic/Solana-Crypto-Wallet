// src/models/PointsModel.ts

import { Pool } from 'pg';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'PointsModel';

class PointsModel {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    public async savePointsChallenge(userId: string, challengeId: number, points: number): Promise<void> {
        logger.info(`Saving ${points} points for user: ` + userId, { className });
        const sqlQuery = `
            INSERT INTO points (userId, challengeId, points)
            VALUES ($1, $2, $3);
        `;

        try{
            await this.db.query(sqlQuery, [userId, challengeId, points]);

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
            VALUES ($1, $2, $3);
        `;

        try {
            await this.db.query(sqlQuery, [userId, quizDifficulty, points]);

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
            WHERE userId = $1 AND challengeId = $2;
        `;

        try {
            const result = await this.db.query(sqlQuery, [userId, challengeId]);

            logger.info('Points found', { className });
            return result.rows[0];
        } catch (err) {
            logger.error('Error finding points: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new PointsModel();
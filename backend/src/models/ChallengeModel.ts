// src/models/ChallengeModel.ts

import { Pool } from 'pg';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'ChallengeModel';

class ChallengeModel {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    public async getAllChallenges(): Promise<any> {
        logger.info('Getting all challenges', { className });
        const sqlQuery = `
            SELECT * FROM challenges;
        `;

        try {
            const result = await this.db.query(sqlQuery);
            return result.rows;
        } catch (err) {
            logger.error('Error getting challenges: ' + err, { error: err, className });
            throw err;
        }
    }

    public async fetchPointsForChallenge(challengeId: number): Promise<number> {
        logger.info('Fetching points for challenge', { className });
        const sqlQuery = `
            SELECT points FROM challenges WHERE id = $1;
        `;

        try {
            const result = await this.db.query(sqlQuery, [challengeId]);

            return result.rows[0].points;
        } catch (err) {
            logger.error('Error fetching points for challenge: ' + err, { error: err, className });
            throw err;
        }
    }
}

export default new ChallengeModel();
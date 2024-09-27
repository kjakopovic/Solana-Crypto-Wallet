// src/models/ChallengeModel.ts


import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'ChallengeModel';

class ChallengeModel {
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    public async getAllChallenges(): Promise<any> {
        logger.info('Getting all challenges', { className });
        const sqlQuery = `
            SELECT * FROM challenges;
        `;

        try {
            const result = await this.db.request().query(sqlQuery);
            return result.recordset;
        } catch (err) {
            logger.error('Error getting challenges: ' + err, { error: err, className });
            throw err;
        }
    }

    public async fetchPointsForChallenge(challengeId: number): Promise<number> {
        logger.info('Fetching points for challenge', { className });
        const sqlQuery = `
            SELECT points FROM challenges WHERE id = @challengeId;
        `;

        try {
            const result = await this.db.request()
                .input('challengeId', challengeId)
                .query(sqlQuery);
            return result.recordset[0].points;
        } catch (err) {
            logger.error('Error fetching points for challenge: ' + err, { error: err, className });
            throw err;
        }
    }


}

export default new ChallengeModel();
// src/config/database/Database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../Logger';
import { initializeDatabase } from './Initialize';
import { dbConfig } from '../Config';

dotenv.config();

const className = 'Database';

async function createPool() {
    const dbConfigResult = await dbConfig;
    return new Pool(dbConfigResult);
}

const poolPromise = createPool();

async function connectToDatabase() {
    try {
        const client = await (await poolPromise).connect();
        console.log('Connected to PostgreSQL');
        logger.info('Connected to PostgreSQL', { className });
        if (process.env.NODE_ENV !== 'test') {
            await initializeDatabase(client);
            logger.info('Database initialized', { className });
        } else {
            console.log("USING TEST DATABASE");
            logger.info('USING TEST DATABASE', { className });
        }

        client.release();
    } catch (err) {
        console.error('Database connection failed:', err);
        logger.error({ message: 'Database connection failed', error: err, className });
    }
}

connectToDatabase();

export default poolPromise;
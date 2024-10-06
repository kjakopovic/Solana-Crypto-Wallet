// src/config/database/Database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../Logger';
import { initializeDatabase } from './Initialize';

dotenv.config();

const className = 'Database';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: false, // Disable SSL
});

async function connectToDatabase() {
    try {
        const client = await pool.connect();
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

export default pool;
// src/config/database/Database.ts

import pool from './Connection';
import { initializeDatabase } from './Initialize';
import logger from '../Logger';
const className = 'Database';

if(process.env.NODE_ENV === 'test') {
    pool.connect()
        .then(async () => {
            console.log('Connected to SQL Server');
            logger.info('Connected to SQL Server', { className });
        })
        .catch(err => {
            console.error('Database connection failed:', err);
            logger.error({ message: 'Database connection failed', error: err, className });
        });
}else{
    pool.connect()
        .then(async () => {
            console.log('Connected to SQL Server');
            logger.info('Connected to SQL Server', { className });
            await initializeDatabase(pool);
            logger.info('Database initialized', { className });
        })
        .catch(err => {
            console.error('Database connection failed:', err);
            logger.error({ message: 'Database connection failed', error: err, className });
        });
}

export default pool;
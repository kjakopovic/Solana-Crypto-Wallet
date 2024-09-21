// src/config/database/Database.ts

import pool from './Connection';
import { initializeDatabase } from './Initialize';
import logger from '../Logger';
import { checkForNewDay } from '../../utils/dailyTasks';

const className = 'Database';

pool.connect()
    .then(async () => {
        console.log('Connected to SQL Server');
        logger.info('Connected to SQL Server', { className });
        await initializeDatabase(pool);
        logger.info('Database initialized', { className });
        logger.info('Checking for new day', { className });
        await checkForNewDay();
        logger.info('New day checked', { className });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        logger.error({ message: 'Database connection failed', error: err, className });
    });

export default pool;
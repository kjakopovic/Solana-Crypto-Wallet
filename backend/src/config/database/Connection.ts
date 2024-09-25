// src/config/database/Connection.ts

import { ConnectionPool,  } from 'mssql';
import logger from '../Logger';
import { dbConfig } from '../Config';

const className = 'Connection';
const pool = new ConnectionPool(dbConfig);

pool.on('error', err => {
    console.error('SQL Error:', err);
    logger.error('SQL Error:', { error: err, className });
});

pool.on('connect', () => {
    console.log('Successfully connected to the database');
    logger.info('Successfully connected to the database', { className });
});

pool.on('info', info => {
    console.log('SQL Info:', info);
    logger.info('SQL Info:', { info, className });
});

export default pool;
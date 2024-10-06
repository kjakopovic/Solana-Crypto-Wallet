// src/config/database/Connection.ts
import { Pool } from 'pg';
import { dbConfig } from '../Config';
import logger from '../Logger';

const className = 'Connection';
const pool = new Pool(dbConfig);

pool.on('error', (err) => {
    console.error('PostgreSQL Error:', err);
    logger.error('PostgreSQL Error:', { error: err, className });
});

pool.connect()
    .then(client => {
        console.log('Successfully connected to the database');
        logger.info('Successfully connected to the database', { className });
        client.release();
    })
    .catch(err => {
        console.error('Connection Error:', err);
        logger.error('Connection Error:', { error: err, className });
    });

export default pool;
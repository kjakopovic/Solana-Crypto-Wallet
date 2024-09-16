// src/config/Database.ts

import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';
import logger from './Logger';

dotenv.config();
const className = 'Database';

const config = {
    user: process.env.DB_USER || 'dbAdmin',
    password: process.env.DB_PASSWORD || 'Password123!',
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_DATABASE || 'walletDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

console.log('Database configuration:', config);

const pool = new ConnectionPool(config);

pool.connect()
    .then(async () => {
        console.log('Connected to SQL Server');
        await initializeDatabase(pool);
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
    });

export const initializeDatabase = async (pool: ConnectionPool) => {
    logger.info('Initializing database', { className });
    try {
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
            BEGIN
                CREATE TABLE users (
                    id NVARCHAR(255) PRIMARY KEY,
                    username NVARCHAR(50) NOT NULL,
                    password NVARCHAR(255) NOT NULL,
                    publicKey NVARCHAR(255),
                    refreshToken NVARCHAR(255)
                )
            END
        `);
        logger.info('Database initialized successfully', { className });
    } catch (error) {
        logger.error({ message: 'Error initializing database', error, className });
    }
};


export default pool;

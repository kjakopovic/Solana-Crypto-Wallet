// src/config/Database.ts

import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

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
    .then(() => {
        console.log('Connected to SQL Server');
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
    });

export default pool;

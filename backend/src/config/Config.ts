// src/config/Config.ts

import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
    user: process.env.DB_USER || 'dbAdmin',
    password: process.env.DB_PASSWORD || 'Password123!',
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_DATABASE || 'walletDB',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
}
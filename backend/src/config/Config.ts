// src/config/Config.ts
import dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbServer = process.env.DB_SERVER;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

if (!dbUser || !dbPassword || !dbServer || !dbPort || !dbName) {
    throw new Error('Missing required database environment variables');
}

export const dbConfig = {
    user: dbUser,
    host: dbServer,
    database: dbName,
    password: dbPassword,
    port: parseInt(dbPort, 10),
    ssl: {
        rejectUnauthorized: false
    }
};
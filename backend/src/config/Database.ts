// src/config/Database.ts

import { ConnectionPool,  } from 'mssql';
import dotenv from 'dotenv';
import logger from './Logger';
import xlsx from 'xlsx';

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

// Connect to the database and initialize it
pool.connect()
    .then(async () => {
        console.log('Connected to SQL Server');
        logger.info('Connected to SQL Server', { className });
        await initializeDatabase(pool);
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        logger.error({ message: 'Database connection failed', error: err, className });
    });

const initializeDatabase = async (pool: ConnectionPool) => {
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
                    refreshToken NVARCHAR(MAX)
                )
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'images')
            BEGIN
                CREATE TABLE images (
                    symbol NVARCHAR(50) PRIMARY KEY NOT NULL,
                    url NVARCHAR(MAX) NOT NULL,
                    png NVARCHAR(MAX) NOT NULL
                )
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'quizzes')
            BEGIN
                CREATE TABLE quizzes (
                    id INT PRIMARY KEY NOT NULL,
                    question NVARCHAR(MAX) NOT NULL,
                    difficulty NVARCHAR(50) NOT NULL,
                    correctAnswer NVARCHAR(MAX) NOT NULL,
                    option2 NVARCHAR(MAX) NOT NULL,
                    option3 NVARCHAR(MAX) NOT NULL,
                    option4 NVARCHAR(MAX) NOT NULL
                )
            END
        `);

        const result = await pool.request().query(`SELECT COUNT(*) AS count FROM quizzes`);
        const count = result.recordset[0].count;

        if (count < 90){
            await populateQuizzesTable(pool);
        }

        logger.info('Database initialized successfully', { className });
    } catch (error) {
        logger.error({ message: 'Error initializing database', error, className });
    }
};

const populateQuizzesTable = async (pool: ConnectionPool) => {
    logger.info('Populating quizzes table', { className });

    try{
        const workbook = xlsx.readFile('../backend/src/data/quizz.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const questions: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        questions.shift(); // Remove the header row

        for (const row of questions) {
            const [id, question, difficulty, correctAnswer, option2, option3, option4] = row;
            await pool.request()
                .input('id', id)
                .input('question', question)
                .input('difficulty', difficulty)
                .input('correctAnswer', correctAnswer)
                .input('option2', option2)
                .input('option3', option3)
                .input('option4', option4)
                .query(`
                    INSERT INTO quizzes (id, question, difficulty, correctAnswer, option2, option3, option4)
                    VALUES (@id, @question, @difficulty, @correctAnswer, @option2, @option3, @option4)
                `);
        }

        logger.info('Quizzes table populated successfully', {className});
    } catch (error) {
        logger.error({ message: 'Error populating quizzes table: ' + error, error, className });
    }
}

export default pool;

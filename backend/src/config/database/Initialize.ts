// src/config/database/Initialize.ts

import { ConnectionPool } from 'mssql';
import logger from '../Logger';
import xlsx from 'xlsx';

const className = 'Initialize';

export const initializeDatabase = async (pool: ConnectionPool) => {
    logger.info('Initializing database', { className });
    try {
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
            BEGIN
                CREATE TABLE users (
                    id NVARCHAR(255) PRIMARY KEY,
                    username NVARCHAR(50) NOT NULL,
                    imageUrl NVARCHAR(MAX) NOT NULL,
                    password NVARCHAR(255) NOT NULL,
                    publicKey NVARCHAR(255),
                    joinedAt DATETIME DEFAULT GETDATE(),
                    refreshToken NVARCHAR(MAX),
                    points BIGINT,
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

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'challenges')
            BEGIN
                CREATE TABLE challenges (
                    id INT PRIMARY KEY NOT NULL,
                    name NVARCHAR(255) NOT NULL,
                    description NVARCHAR(MAX) NOT NULL,
                    points INT NOT NULL
                )
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'points')
            BEGIN
                CREATE TABLE points (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    userId NVARCHAR(255) FOREIGN KEY REFERENCES users(id),
                    timestamp DATETIME DEFAULT GETDATE(),
                    challengeId INT FOREIGN KEY REFERENCES challenges(id) DEFAULT NULL,
                    quizDifficulty NVARCHAR(10) DEFAULT NULL,
                    points INT NOT NULL
                )
            END
        `);

        const resultQuiz = await pool.request().query(`SELECT COUNT(*) AS count FROM quizzes`);
        const countQuiz = resultQuiz.recordset[0].count;

        // This is currently hardcoded to 93 because the quiz Excel file has 93 questions
        // If number of questions gets updated in the Excel file, this number should be updated
        if (countQuiz < 93){
            await populateQuizzesTable(pool);
        }

        const resultChallenge = await pool.request().query(`SELECT COUNT(*) AS count FROM challenges`);
        const countChallenge = resultChallenge.recordset[0].count;

        // This is currently hardcoded to 12 because the challenge Excel file has 12 challenges
        // If number of challenges gets updated in the Excel file, this number should be updated
        if(countChallenge < 12){
            await populateChallengesTable(pool);
        }


        logger.info('Database initialized successfully', { className });
    } catch (error) {
        logger.error({ message: 'Error initializing database: '+ error, error, className });
    }
};

const populateQuizzesTable = async (pool: ConnectionPool) => {
    logger.info('Populating quizzes table', { className });

    try{
        const workbook = xlsx.readFile('../backend/src/data/excel/quiz.xlsx');
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

const populateChallengesTable = async (pool: ConnectionPool) => {
    logger.info('Populating challenges table', { className });

    try{
        const workbook = xlsx.readFile('../backend/src/data/excel/challenges.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const challenges: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        challenges.shift(); // Remove the header row

        for (const row of challenges) {
            const [id, name, description, points] = row;
            await pool.request()
                .input('id', id)
                .input('name', name)
                .input('description', description)
                .input('points', points)
                .query(`
                    INSERT INTO challenges (id,name, description, points)
                    VALUES (@id, @name, @description, @points)
                `);
        }

        logger.info('Challenges table populated successfully', {className});
    } catch (error) {
        logger.error({ message: 'Error populating challenges table: ' + error, error, className });
    }
}


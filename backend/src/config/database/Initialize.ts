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
                    password NVARCHAR(255) NOT NULL,
                    publicKey NVARCHAR(255),
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
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dailyQuiz')
            BEGIN
                CREATE TABLE dailyQuiz (
                    date DATE PRIMARY KEY NOT NULL,
                    question1Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question2Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question3Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question4Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question5Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question6Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question7Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question8Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question9Id INT FOREIGN KEY REFERENCES quizzes(id),
                    question10Id INT FOREIGN KEY REFERENCES quizzes(id),
                )
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'points')
            BEGIN
                CREATE TABLE points (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    userId NVARCHAR(255) FOREIGN KEY REFERENCES users(id),
                    date DATE NOT NULL,
                    points INT NOT NULL,
                    fromChallenge BIT NOT NULL,
                    fromDailyQuiz BIT NOT NULL,
                    questionId INT FOREIGN KEY REFERENCES quizzes(id),
                )
            END
        `);

        const result = await pool.request().query(`SELECT COUNT(*) AS count FROM quizzes`);
        const count = result.recordset[0].count;

        // This is currently hardcoded to 90 because the quiz Excel file has 90 questions
        // If number of questions gets updated in the Excel file, this number should be updated
        if (count < 90){
            await populateQuizzesTable(pool);
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


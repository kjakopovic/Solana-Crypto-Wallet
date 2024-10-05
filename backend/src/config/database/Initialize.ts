// src/config/database/Initialize.ts

import { ConnectionPool } from 'mssql';
import logger from '../Logger';
import xlsx from 'xlsx';
import fs from 'fs';
import path from  'path';

const className = 'Initialize';

export const initializeDatabase = async (pool: ConnectionPool) => {
    logger.info('Initializing database', { className });

    try{
        const createTableSQLPath = path.join(__dirname, '../../data/sql/create-tables.sql');
        const createTableSQL = fs.readFileSync(createTableSQLPath, 'utf-8');
        await pool.request().query(createTableSQL);

        const resultQuiz = await pool.request().query(`SELECT COUNT(*) AS count FROM quizzes`);
        const countQuiz = resultQuiz.recordset[0].count;

        logger.info('Checking population of quizzes and challenges tables', { className });

        // This is currently hardcoded to 93 because the quiz Excel file has 93 questions
        // If number of questions gets updated in the Excel file, this number should be updated
        if (countQuiz < 93){
            logger.info('Populating quizzes table', { className });
            await populateQuizzesTable(pool);
        }

        const resultChallenge = await pool.request().query(`SELECT COUNT(*) AS count FROM challenges`);
        const countChallenge = resultChallenge.recordset[0].count;

        // This is currently hardcoded to 12 because the challenge Excel file has 12 challenges
        // If number of challenges gets updated in the Excel file, this number should be updated
        if(countChallenge < 12){
            logger.info('Populating challenges table', { className });
            await populateChallengesTable(pool);
        }

        logger.info('Checking if procedures exist', { className });
        const createProceduresSQLPath = path.join(__dirname, '../../data/sql/create-procedures.sql');
        const createProceduresSQL = fs.readFileSync(createProceduresSQLPath, 'utf-8');
        await pool.request().query(createProceduresSQL);

        logger.info('Database initialized successfully', { className });
    }catch(error){
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


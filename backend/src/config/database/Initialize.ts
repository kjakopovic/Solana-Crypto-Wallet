// src/config/database/Initialize.ts

import logger from '../Logger';
import xlsx from 'xlsx';
import fs from 'fs';
import path from  'path';
import {PoolClient} from "pg";

const className = 'Initialize';

export const initializeDatabase = async (client: PoolClient) => {
    logger.info('Initializing database', { className });

    try{
        const createTableSQLPath = path.join(__dirname, '../../data/sql/create-tables.sql');
        const createTableSQL = fs.readFileSync(createTableSQLPath, 'utf-8');
        await client.query(createTableSQL);

        const resultQuiz = await client.query(`SELECT COUNT(*) AS count FROM quizzes`);
        const countQuiz = resultQuiz.rows[0].count;

        logger.info('Checking population of quizzes and challenges tables', { className });

        // This is currently hardcoded to 93 because the quiz Excel file has 93 questions
        // If number of questions gets updated in the Excel file, this number should be updated
        if (countQuiz < 93) {
            logger.info('Populating quizzes table', { className });
            await populateQuizzesTable(client);
        }

        const resultChallenge = await client.query(`SELECT COUNT(*) AS count FROM challenges`);
        const countChallenge = resultChallenge.rows[0].count;

        // This is currently hardcoded to 6 because the challenge Excel file has 6 challenges
        // If number of challenges gets updated in the Excel file, this number should be updated
        if (countChallenge < 6) {
            logger.info('Populating challenges table', { className });
            await populateChallengesTable(client);
        }

        const numberOfUsers = await client.query(`SELECT COUNT(*) AS count FROM users`);
        const numberOfSupportQuestions = await client.query(`SELECT COUNT(*) AS count FROM supportQuestions`);

        if (numberOfUsers.rows[0].count < 3 || numberOfSupportQuestions.rows[0].count < 3) {
            logger.info('Inserting dummy data', { className });
            const dummyDataSQLPath = path.join(__dirname, '../../data/sql/dummy-data.sql');
            const dummyDataSQL = fs.readFileSync(dummyDataSQLPath, 'utf-8');
            await client.query(dummyDataSQL);
            logger.info('Dummy data inserted successfully', { className });
        } else {
            logger.info('Dummy data already exists, skipping insertion', { className });
        }

        logger.info('Database initialized successfully', { className });
    }catch(error){
        logger.error({ message: 'Error initializing database: '+ error, error, className });
    }
};

const populateQuizzesTable = async (client: PoolClient) => {
    logger.info('Populating quizzes table', { className });

    try{
        const workbook = xlsx.readFile('../backend/src/data/excel/quiz.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const questions: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        questions.shift(); // Removes the header row

        for (const row of questions) {
            const [id, question, difficulty, correctAnswer, option2, option3, option4] = row;
            await client.query(`
                INSERT INTO quizzes (id, question, difficulty, correctAnswer, option2, option3, option4)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [id, question, difficulty, correctAnswer, option2, option3, option4]);
        }

        logger.info('Quizzes table populated successfully', {className});
    } catch (error) {
        logger.error({ message: 'Error populating quizzes table: ' + error, error, className });
    }
}

const populateChallengesTable = async (client: PoolClient) => {
    logger.info('Populating challenges table', { className });

    try {
        const workbook = xlsx.readFile(path.join(__dirname, '../../data/excel/challenges.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const challenges: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        challenges.shift();

        for (const row of challenges) {
            const [id, name, description, points, status] = row;
            if (!id) {
                logger.warn(`Skipping challenge with missing id: ${JSON.stringify(row)}`, { className });
                continue;
            }
            await client.query(`
                INSERT INTO challenges (id, name, description, points, status)
                VALUES ($1, $2, $3, $4, $5)
            `, [id, name, description, points, status]);
        }

        logger.info('Challenges table populated successfully', { className });
    } catch (error) {
        logger.error({ message: 'Error populating challenges table: ' + error, error, className });
    }
};
// src/utils/dailyTasks.ts

import logger from '../config/Logger';
import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';

const className = 'DailyTasks';

const getRandomQuizQuestions = async (pool: ConnectionPool, count: number): Promise<number[]> => {
    logger.info(`Getting ${count} random quiz questions`, { className });
    const result = await pool.request().query(`
        SELECT TOP ${count} id 
        FROM quizzes 
        ORDER BY NEWID()
    `);
    return result.recordset.map((row: { id: number }) => row.id);
};

const getLastThreeDaysQuestions = async (pool: ConnectionPool): Promise<number[]> => {
    logger.info('Getting last three days questions', { className });
    const result = await pool.request().query(`
        SELECT question1Id, question2Id, question3Id, question4Id, question5Id,
               question6Id, question7Id, question8Id, question9Id, question10Id
        FROM dailyQuiz 
        WHERE date = DATEADD(DAY, -3, GETDATE())
    `);

    const questions = new Set<number>();
    result.recordset.forEach((row: any) => {
        Object.values(row).forEach((id: unknown) => questions.add(id as number));
    });
    return Array.from(questions);

}

const checkIfRowExistsForToday = async (pool: ConnectionPool): Promise<boolean> => {
    logger.info('Checking if row exists for today', { className });
    const date = new Date().toISOString().split('T')[0];
    const result = await pool.request()
        .input('date', date)
        .query(`
            SELECT COUNT(*) AS count
            FROM dailyQuiz
            WHERE date = @date
        `);
    return result.recordset[0].count > 0;
}

const insertDailyQuizQuestions = async (pool: ConnectionPool, questionIds: number[]): Promise<void> => {
    logger.info('Inserting daily quiz questions', { className });
    const date = new Date().toISOString().split('T')[0];
    await pool.request()
        .input('date', date)
        .input('question1Id', questionIds[0])
        .input('question2Id', questionIds[1])
        .input('question3Id', questionIds[2])
        .input('question4Id', questionIds[3])
        .input('question5Id', questionIds[4])
        .input('question6Id', questionIds[5])
        .input('question7Id', questionIds[6])
        .input('question8Id', questionIds[7])
        .input('question9Id', questionIds[8])
        .input('question10Id', questionIds[9])
        .query(`
            INSERT INTO dailyQuiz (date, question1Id, question2Id, question3Id, question4Id, question5Id, 
                                   question6Id, question7Id, question8Id, question9Id, question10Id)
            VALUES (@date, @question1Id, @question2Id, @question3Id, @question4Id, @question5Id, 
                    @question6Id, @question7Id, @question8Id, @question9Id, @question10Id)
        `);
}


const onNewDay = async () => {
    logger.info('New day has started', { className });

    try {
        const rowExists = await checkIfRowExistsForToday(pool);
        if (rowExists) {
            logger.info('Row already exists for today', { className });
            return;
        }

        const lastThreeDaysQuestions = await getLastThreeDaysQuestions(pool);
        let questionIds: number[] = [];

        while (questionIds.length < 10) {
            const randomQuestions = await getRandomQuizQuestions(pool, 10 - questionIds.length);
            randomQuestions.forEach(id => {
                if (!lastThreeDaysQuestions.includes(id) && !questionIds.includes(id)) {
                    questionIds.push(id);
                }
            });
        }

        await insertDailyQuizQuestions(pool, questionIds);
        logger.info('Daily quiz questions inserted successfully', { className });
    } catch (error) {
        logger.error({ message: 'Error in daily quiz task: ' + error, error, className });
    }
};

export const checkForNewDay = async () => {
    logger.info('Checking for new day', { className });
    let lastDay = new Date().toDateString();

    await onNewDay();

    setInterval(async () => {
        const currentDate = new Date().toDateString();
        if(currentDate !== lastDay){
            lastDay = currentDate;
            await onNewDay();
        }
    }, 3600000); // Check every hour (3600000 ms)

    logger.info('New day check finished', { className });
};

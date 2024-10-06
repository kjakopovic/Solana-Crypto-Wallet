// src/models/SupportQuestionModel.ts

import logger from '../config/Logger';
import poolPromise from '../config/database/Database';

const className = 'SupportQuestionModel';

class SupportQuestionModel{
    // Insert new support question
    public async createSupportQuestion(userId: string, title:string, description: string): Promise<void>{
        logger.info("Called createSupportQuestion method", {className});
        const sqlQuery = `
            INSERT INTO supportQuestions (userId, title, description)
            VALUES ($1, $2, $3);
        `;

        try{
            await (await poolPromise).query(sqlQuery, [userId, title, description]);

            logger.info('Question created and saved successfully', {className});
            console.log('Question created and saved successfully');
        }catch (err){
            logger.error('Error creating support question', { error: err, className });
            throw err;
        }
    }

    // Answer support question
    public async answerSupportQuestion(questionId: number, answer: string): Promise<void>{
        logger.info("Called answerSupportQuestion method", {className});
        const sqlQuery = `
            UPDATE supportQuestions
            SET answer = $1, answered = 1
            WHERE id = $2;
        `;


        try{
            await (await poolPromise).query(sqlQuery, [answer, questionId]);

            logger.info('Question answered successfully', {className});
            console.log('Question answered successfully');
        }catch (err){
            logger.error('Error answering support question', { error: err, className });
            throw err;
        }
    }

    // Fetch support question by given field
    public async fetchSupportQuestionByField(field: string, value: string): Promise<any>{
        logger.info("Called fetchSupportQuestionByField method", {className});
        const sqlQuery = `
            SELECT * FROM supportQuestions WHERE ${field} = $1;
        `;

        try{
            const result = await (await poolPromise).query(sqlQuery, [value]);

            logger.info('Support question fetched successfully', {className});
            return result.rows;
        }catch (err){
            logger.error('Error fetching support question', { error: err, className });
            throw err;
        }
    }

    public async fetchAllSupportQuestions(): Promise<any>{
        logger.info("Called fetchAllSupportQuestions method", {className});
        const sqlQuery = `
            SELECT * FROM supportQuestions;
        `;

        try{
            const result = await (await poolPromise).query(sqlQuery);
            logger.info('Support questions fetched successfully', {className});
            return result.rows;
        }catch (err){
            logger.error('Error fetching support questions', { error: err, className });
            throw err;
        }
    }
}

export default new SupportQuestionModel();
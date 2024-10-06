// src/models/SupportQuestionModel.ts

import logger from '../config/Logger';
import pool from '../config/database/Database';
import { ConnectionPool } from 'mssql';

const className = 'SupportQuestionModel';

class SupportQuestionModel{
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    // Insert new support question
    public async createSupportQuestion(userId: string, title:string, description: string): Promise<void>{
        logger.info("Called createSupportQuestion method", {className});
        const sqlQuery = `
            INSERT INTO supportQuestions (userId, title, description)
            VALUES (@userId, @title, @description);
        `;

        try{
            await this.db.request()
                .input('userId', userId)
                .input('title', title)
                .input('description', description)
                .query(sqlQuery);

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
            SET answer = @answer
            WHERE id = @questionId;
        `;

        try{
            await this.db.request()
                .input('answer', answer)
                .input('questionId', questionId)
                .input('answered', 1)
                .query(sqlQuery);

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
            SELECT * FROM supportQuestions WHERE ${field} = @value;
        `;

        try{
            const result = await this.db.request()
                .input('value', value)
                .query(sqlQuery);

            logger.info('Support question fetched successfully', {className});
            return result.recordset;
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
            const result = await this.db.request().query(sqlQuery);
            logger.info('Support questions fetched successfully', {className});
            return result.recordset;
        }catch (err){
            logger.error('Error fetching support questions', { error: err, className });
            throw err;
        }
    }

}

export default new SupportQuestionModel();
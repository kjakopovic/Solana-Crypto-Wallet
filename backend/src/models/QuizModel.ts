// src/models/QuizModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'QuizModel';
const dailyQuizQuestions: string[] = [
    "question1Id",
    "question2Id",
    "question3Id",
    "question4Id",
    "question5Id",
    "question6Id",
    "question7Id",
    "question8Id",
    "question9Id",
    "question10Id"
];

export interface Quiz{
    id: number;
    question: string;
    difficulty: string;
    A: string;
    B: string;
    C: string;
    D: string;
}

export class QuizModel {
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    public async getDailyQuizQuestionId(question: number){
        logger.info('Getting daily quiz', { className });
        const questionId = dailyQuizQuestions[question - 1];

        const sqlQuery = `
            SELECT ${questionId} FROM dailyQuiz
        `;

        try {
            const result = await this.db.request()
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                return null;
            }

            logger.info('Daily quiz question found', { className });
            const quiz = this.fetchQuizQuestionById(result.recordset[0][questionId]);
            logger.info('Daily quiz question found, returning quiz', { className });
            return quiz;
        } catch (err) {
            logger.error('Error getting daily quiz question', { error: err, className });
            throw err;
        }

    }

    private async fetchQuizQuestionById(id: number): Promise<Quiz | null> {
        logger.info('Getting quiz question by id', { className });
        const sqlQuery = `
            SELECT * FROM quizzes WHERE id = @id;
        `;

        try {
            const result = await this.db.request()
                .input('id', id)
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                return null;
            }

            logger.info('Quiz question found by id', { className });
            const quiz = result.recordset[0];

            const answers = [
                { letter: 'A', text: quiz.correctAnswer },
                { letter: 'B', text: quiz.option2 },
                { letter: 'C', text: quiz.option3 },
                { letter: 'D', text: quiz.option4 }
            ]

            // Fisher-Yates shuffle
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }

            // Map the shuffled answers to the quiz object
            const shuffledQuiz = {
                id: quiz.id,
                question: quiz.question,
                difficulty: quiz.difficulty,
                correctAnswer: quiz.correctAnswer,
                A: answers[0].text,
                B: answers[1].text,
                C: answers[2].text,
                D: answers[3].text
            }

            logger.info('Quiz question shuffled, returning shuffled quiz', { className });
            return shuffledQuiz;
        } catch (err) {
            logger.error('Error getting quiz question by id', { error: err, className });
            throw err;
        }
    }

    async getQuizQuestionById(id: number): Promise<Quiz | null> {
        logger.info('Getting quiz question by id', { className });
        const sqlQuery = `
            SELECT * FROM quizzes WHERE id = @id;
        `;

        try {
            const result = await this.db.request()
                .input('id', id)
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                return null;
            }

            logger.info('Quiz question found by id', { className });
            return result.recordset[0];
        } catch (err) {
            logger.error('Error getting quiz question by id', { error: err, className });
            throw err;
        }
    }

}

export default new QuizModel();
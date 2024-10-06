// src/models/QuizModel.ts

import { Pool } from 'pg';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'QuizModel';

export interface Quiz{
    id: number;
    question: string;
    difficulty: string;
    correctAnswer: string;
    A: string;
    B: string;
    C: string;
    D: string;
}

export class QuizModel {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async fetchQuizByDifficulty(difficulty: string): Promise<Quiz | null> {
        logger.info('Getting quiz question by difficulty: ' + difficulty, { className });

        // Query to get a random quiz question by difficulty
        const sqlQuery = `
            SELECT id, question, difficulty, correctAnswer, option2, option3, option4
            FROM (
                SELECT ROW_NUMBER() OVER(PARTITION BY difficulty ORDER BY difficulty ASC) AS Number, *
                FROM quizzes
                WHERE difficulty = $1
                ) AS subquery
            WHERE Number = $2;
        `;

        // Query to get the count of quiz questions by difficulty
        const countSqlQuery = `
            SELECT COUNT(*) AS count FROM quizzes WHERE difficulty = $1;
        `;

        try {
            const countResult = await this.db.query(countSqlQuery, [difficulty]);


            if (countResult.rows.length === 0) {
                logger.error('No quiz questions found by difficulty', { className });
                return null;
            }

            const randomNumber = Math.floor(Math.random() * countResult.rows[0].count) + 1;

            const result = await this.db.query(sqlQuery, [difficulty, randomNumber]);

            if (result.rows.length === 0) {
                logger.error('No quiz questions found by difficulty', { className });
                return null;
            }
            const quiz = result.rows[0];

            logger.info('Random quiz chosen. Selected question id: ' + quiz.id, { className });
            logger.info('Shuffling quiz answers', { className });

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
            logger.error('Error getting quiz question by difficulty', { error: err, className });
            throw err;
        }
    }
}

export default new QuizModel();
// src/app.ts

import express, { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import UserRoutes from './routes/UserRoutes';
import JwtRoutes from './routes/JwtRoutes';
import QuizRoutes from './routes/QuizRoutes';
import PointsRoutes from './routes/PointsRoutes';
import ChallengeRoutes from './routes/ChallengeRoutes';
import SupportQuestionRoutes from './routes/SupportQuestionRoutes';
import dotenv from 'dotenv';
import './config/database/Database';
import swaggerDocs from './config/Swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

swaggerDocs(app);

app.use(express.json());

app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/jwt', JwtRoutes);
app.use('/api/v1/quiz', QuizRoutes);
app.use('/api/v1/points', PointsRoutes);
app.use('/api/v1/challenges', ChallengeRoutes);
app.use('/api/v1/support-question', SupportQuestionRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

/*
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});*/

export default app;
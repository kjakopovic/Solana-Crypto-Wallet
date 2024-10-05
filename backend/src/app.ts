// src/app.ts

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import UserRoutes from './routes/UserRoutes';
import JwtRoutes from './routes/JwtRoutes';
import QuizRoutes from './routes/QuizRoutes';
import PointsRoutes from './routes/PointsRoutes';
import ChallengeRoutes from './routes/ChallengeRoutes';
import SupportQuestionRoutes from './routes/SupportQuestionRoutes';
import NFTRoutes from './routes/NFTRoutes';
import dotenv from 'dotenv';
import './config/database/Database';
import swaggerDocs from './config/Swagger';
import buildCors from './config/Cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

buildCors(app);
swaggerDocs(app);

app.use(express.json());
app.use('/user', UserRoutes);
app.use('/jwt', JwtRoutes);
app.use('/quiz', QuizRoutes);
app.use('/points', PointsRoutes);
app.use('/challenges', ChallengeRoutes);
app.use('/support-question', SupportQuestionRoutes);
app.use('/nft', NFTRoutes);

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
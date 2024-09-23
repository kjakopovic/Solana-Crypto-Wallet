// src/app.ts

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import WalletRoutes from './routes/WalletRoutes';
import UserRoutes from './routes/UserRoutes';
import JwtRoutes from './routes/JwtRoutes';
import QuizRoutes from './routes/QuizRoutes';
import PointsRoutes from './routes/PointsRoutes';
import dotenv from 'dotenv';
import './config/database/Database';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/wallet', WalletRoutes);
app.use('/user', UserRoutes);
app.use('/jwt', JwtRoutes);
app.use('/quiz', QuizRoutes);
app.use('/points', PointsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

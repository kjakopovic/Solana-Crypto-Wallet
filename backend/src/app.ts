// src/app.ts

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import WalletRoutes from './routes/WalletRoutes';
import UserRoutes from './routes/UserRoutes';
import JwtRoutes from './routes/JwtRoutes';
import ImageRoutes from './routes/ImageRoutes';
import dotenv from 'dotenv';
import './config/Database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/wallet', WalletRoutes);
app.use('/user', UserRoutes);
app.use('/jwt', JwtRoutes);
app.use('/image', ImageRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
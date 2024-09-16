// src/app.ts

import express from 'express';
import WalletRoutes from './routes/WalletRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/wallet', WalletRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
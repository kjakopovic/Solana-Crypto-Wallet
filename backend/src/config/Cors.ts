import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
    origin: process.env.CORS_ALLOWED_ORIGINS ?? '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  };

export default function buildCors(app: express.Express){
    app.use(cors(corsOptions));
}
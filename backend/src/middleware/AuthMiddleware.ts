// src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import JwtController from "../controllers/JwtController";
import logger from "../config/Logger";

const className = 'AuthMiddleware';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authenticating user', { className });
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        logger.error('No token provided', { className });
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const response = await JwtController.verifyAccessTokenController({ body: { accessToken } } as Request, res);
        if (response.statusCode !== 200) {
            logger.error('Invalid token', { className });
            return res.status(response.statusCode).json(response.json());
        }
        next();
    } catch (err) {
        logger.error('An error occurred: ' + err, { className });
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
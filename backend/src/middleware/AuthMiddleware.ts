// src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import logger from "../config/Logger";
import {verifyAccessToken} from "../services/JwtService";

const className = 'AuthMiddleware';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authenticating user', { className });
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        logger.error('No token provided', { className });
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const response = verifyAccessToken(accessToken);
        if(typeof response === 'string'){
            logger.error('Invalid token', { className });
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    } catch (err) {
        logger.error('An error occurred: ' + err, { className });
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
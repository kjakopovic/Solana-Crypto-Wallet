// src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import logger from "../config/Logger";
import JwtService from '../services/JwtService';

const className = 'AuthMiddleware';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authenticating user', { className });

    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    const refreshToken = req.header('x-refresh-token');

    if (!accessToken) {
        logger.error('No token provided', { className });
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const response = JwtService.verifyAccessToken(accessToken);

        if(typeof response === 'string'){
            logger.error('Invalid token', { className });

            if (response === 'expired' && refreshToken) {
                logger.info('Token expired, trying to generate new access token', { className });

                try {
                    const userPayload = await JwtService.verifyRefreshToken(refreshToken);

                    if (userPayload) {
                        const newAccessToken = JwtService.generateAccessToken(userPayload);

                        res.setHeader("x-access-token", newAccessToken);

                        req.headers.authorization = `Bearer ${newAccessToken}`;
                    }
                } catch (error) {
                    logger.error('Error generating new access token: ' + error, { className });
                    
                }
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        next();
    } catch (err) {
        logger.error('An error occurred: ' + err, { className });

        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
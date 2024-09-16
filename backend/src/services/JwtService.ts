// src/backend/JwtService.ts

import jwt from 'jsonwebtoken';
import logger from "../config/Logger";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'supersercretaccesskey';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'supersercretrefreshkey';
const className = 'JwtService';

export const generateAccessToken = (user: { id: string, username: string }) => {
    try {
        logger.info('Generating access token', {className}, { user });
        const token = jwt.sign(user, accessTokenSecret, { expiresIn: '10m' });
        logger.info('Access token generated successfully', {className}, { token });
        return token;
    } catch (error) {
        logger.error('Error generating access token', {className}, { error });
        throw error;
    }
};

export const generateRefreshToken = (user: { id: string, username: string, publicKey: string }) => {
    return jwt.sign(user, refreshTokenSecret, { expiresIn: '2h' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, refreshTokenSecret);
};

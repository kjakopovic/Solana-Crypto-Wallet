// src/backend/JwtService.ts

import jwt from 'jsonwebtoken';
import logger from "../config/Logger";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'supersercretaccesskey';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'supersercretrefreshkey';
const className = 'JwtService';

export const generateAccessToken = (user: { id: string, username: string }) => {
    try {
        logger.info('Generating access token for userId: ' + user.id, {className});
        const token = jwt.sign({ id: user.id, username: user.username }, accessTokenSecret, { expiresIn: '5m' });
        logger.info('Access token generated successfully: ' + token, {className});
        return token;
    } catch (error) {
        logger.error('Error generating access token: ' + error, {className});
        throw error;
    }
};

export const generateRefreshToken = (user: { id: string, username: string, publicKey: string }) => {
    try{
        logger.info('Generating refresh token for userId: ' + user.id, {className});
        const token = jwt.sign({ id: user.id, username: user.username, publicKey: user.publicKey }, refreshTokenSecret, { expiresIn: '2h' });
        logger.info('Refresh token generated successfully: ' + token, {className});
        return token;
    }catch(error){
        logger.error('Error generating refresh token: ' + error, {className});
        throw error;
    }

};

export const verifyAccessToken = (token: string) => {
    logger.info('Verifying access token: ' + token, {className});
    return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
    logger.info('Verifying refresh token: ' + token, {className});
    return jwt.verify(token, refreshTokenSecret);
};

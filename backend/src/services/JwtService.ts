// src/backend/JwtService.ts

import jwt from 'jsonwebtoken';
import logger from "../config/Logger";
import UserModel from "../models/UserModel"; // Import the function to query the database


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

export const verifyRefreshToken = async (token: string) => {
    logger.info('Verifying refresh token: ' + token, {className});

    try{
        const decoded = jwt.verify(token, refreshTokenSecret) as { id: string, username: string, publicKey: string };
        const user = await UserModel.findUserByRefreshToken(decoded.id, token);

        if(!user){
            throw new Error('Refresh token not found in the database');
        }

        return jwt.verify(token, refreshTokenSecret);
    }catch(error){
        logger.error('Error verifying refresh token: ' + error, {className});
        throw error;
    }
};

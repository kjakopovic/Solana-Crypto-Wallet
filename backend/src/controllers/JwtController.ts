import { Request, Response } from 'express';
import { generateAccessToken, verifyRefreshToken, generateRefreshToken, verifyAccessToken } from '../services/JwtService';
import logger from '../config/Logger';

const className = 'JwtController';

export const refreshAccessTokenController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Refreshing token', { className });
    const { refreshToken } = req.body;

    if (!refreshToken) {
        logger.error('Refresh token is required', { className });
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        logger.info('Verifying refresh token', { className });
        const { id, username } = verifyRefreshToken(refreshToken) as { id: string; username: string };
        logger.info(`Refresh token verified for user: ${id}, ${username}`, { className });

        logger.info('Generating new access token', { className });
        const accessToken = generateAccessToken({ id, username });
        logger.info(`Access token generated successfully for user: ${id}, ${username}`, { className, accessToken });

        return res.status(200).json({ accessToken });
    } catch (error) {
        logger.error({ message: 'Invalid refresh token', error, className });
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

export const createRefreshTokenController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Creating refresh token', { className });
    const { id, username, publicKey } = req.body;

    if (!id || !username) {
        logger.error('User ID and username are required', { className });
        return res.status(400).json({ message: 'User ID and username are required' });
    }

    try {
        const refreshToken = generateRefreshToken({ id, username, publicKey });
        logger.info('Refresh token created successfully', { className });
        return res.status(200).json({ refreshToken });
    } catch (error) {
        logger.error({ message: 'Error creating refresh token', error, className });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyAccessTokenController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Verifying access token', { className });
    const { accessToken } = req.body;

    if (!accessToken) {
        logger.error('Access token is required', { className });
        return res.status(401).json({ message: 'Access token is required' });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        logger.info('Access token is valid', { className });
        return res.status(200).json({ valid: true, decoded });
    } catch (error) {
        logger.error({ message: 'Invalid access token', error, className });
        return res.status(403).json({ message: 'Invalid access token' });
    }
}
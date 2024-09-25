import { Request, Response } from 'express';
import { generateAccessToken, verifyRefreshToken, generateRefreshToken, verifyAccessToken } from '../services/JwtService';
import logger from '../config/Logger';
import UserService from "../services/UserService";

const className = 'JwtController';


class JwtController{
    // Controller to refresh the access token
    public refreshAccessTokenController = async (req: Request, res: Response): Promise<Response> => {
        logger.info('Refreshing access token', { className });
        const { refreshToken } = req.body;

        if (!refreshToken) {
            logger.error('Refresh token is required', { className });
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        try {
            const decoded = await verifyRefreshToken(refreshToken);
            if(!decoded){
                logger.error('Refresh token not found in the database', { className });
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            logger.info(`Refresh token verified for user: ${decoded.id}, ${decoded.username}`, { className });

            const accessToken = generateAccessToken({ id: decoded.id, username: decoded.username, publicKey: decoded.publicKey });
            logger.info(`Access token generated successfully for user: ${decoded.id}, ${decoded.username}`, { className, accessToken });

            return res.status(200).json({ accessToken });
        } catch (error) {
            logger.error({ message: 'Invalid refresh token', error, className });
            return res.status(403).json({ message: 'Invalid refresh token', error });
        }
    };

    // Controller to create a refresh token
    public createRefreshTokenController = async (req: Request, res: Response): Promise<Response> => {
        const { username, publicKey } = req.body;
        logger.info(`Creating refresh token for user with publicKey: ${publicKey}`, { className });

        if (!publicKey || !username) {
            logger.error('PublicKey and username are required', { className });
            return res.status(400).json({ message: 'User ID and username are required' });
        }

        const user = await UserService.findUserByField("publicKey", publicKey);
        if(!user){
            logger.error('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }

        try {
            const refreshToken = generateRefreshToken({ id: user.id, username, publicKey });
            logger.info('Refresh token created successfully', { className });
            return res.status(200).json({ refreshToken });
        } catch (error) {
            logger.error({ message: 'Error creating refresh token', error, className });
            return res.status(500).json({ message: 'Internal server error', error });
        }
    };

    // Controller to verify an access token
    public verifyAccessTokenController = async (req: Request, res: Response): Promise<Response> => {
        const { accessToken } = req.body;
        logger.info(`Verifying access token: ${accessToken}`, { className });

        if (!accessToken) {
            logger.error('Access token is required', { className });
            return res.status(401).json({ message: 'Access token is required', error: 'Access token is required' });
        }

        try {
            const decoded = verifyAccessToken(accessToken);
            logger.info('Access token is valid', { className });
            return res.status(200).json({ valid: true, decoded });
        } catch (error) {
            logger.error({ message: 'Invalid access token', error, className });
            return res.status(403).json({ message: 'Invalid access token', error });
        }
    }

    // Controller to verify a refresh token
    public verifyRefreshTokenController = async (req: Request, res: Response): Promise<Response> => {
        const { refreshToken } = req.body;
        logger.info(`Verifying refresh token: ${refreshToken}`, { className });

        if (!refreshToken) {
            logger.error('Refresh token is required', { className });
            return res.status(401).json({ message: 'Refresh token is required', error: 'Refresh token is required' });
        }

        try {
            const decoded = await verifyRefreshToken(refreshToken);
            logger.info('Refresh token is valid', { className });
            return res.status(200).json({ valid: true, decoded });
        } catch (error) {
            logger.error({ message: 'Invalid refresh token', error, className });
            return res.status(403).json({ message: 'Invalid refresh token', error });
        }
    }
}

export default new JwtController();
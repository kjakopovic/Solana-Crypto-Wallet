import { Request, Response } from 'express';
import JwtService from '../services/JwtService';
import logger from '../config/Logger';

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
            const decoded = await JwtService.verifyRefreshToken(refreshToken);
            if(!decoded){
                logger.error('Refresh token not found in the database', { className });
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            logger.info(`Refresh token verified for user: ${decoded.id}, ${decoded.username}`, { className });

            const accessToken = JwtService.generateAccessToken({ id: decoded.id, username: decoded.username, publicKey: decoded.publicKey });
            logger.info(`Access token generated successfully for user: ${decoded.id}, ${decoded.username}`, { className, accessToken });

            return res.status(200).json({ accessToken });
        } catch (error: any) {
            logger.error({ message: error.message, error, className });
            return res.status(403).json({ message: error.message });
        }
    };

    public async verifyRefreshTokenController(req: Request, res: Response){
        logger.info('Verifying refresh token', { className });
        const { refreshToken } = req.body;

        if (!refreshToken) {
            logger.error('Refresh token is required', { className });
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        try {
            const decoded = await JwtService.verifyRefreshToken(refreshToken);
            if(!decoded){
                logger.error('Refresh token not found in the database', { className });
                return res.status(400).json({ message: 'Invalid refresh token' });
            }

            logger.info(`Refresh token verified for user: ${decoded.id}, ${decoded.username}`, { className });

            return res.status(200).json({ message: 'Refresh token is valid' });
        } catch (error: any) {
            logger.error({message: error.message, error, className});
            return res.status(403).json({message: error.message});
        }
    }

}

export default new JwtController();
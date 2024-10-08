// src/backend/JwtService.ts

import jwt, { JwtPayload} from 'jsonwebtoken';
import logger from "../config/Logger";
import UserModel from "../models/UserModel";


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'supersercretaccesskey';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'supersercretrefreshkey';
const className = 'JwtService';

interface UserPayload {
    id: string;
    username: string;
    publicKey: string;
}

class JwtService{

    public generateAccessToken (user: UserPayload){
        try {
            logger.info('Generating access token for userId: ' + user.id, { className });
            const token = jwt.sign({ id: user.id, username: user.username }, accessTokenSecret, { expiresIn: '5m' });
            logger.info('Access token generated successfully: ' + token, { className });
            return token;
        } catch (error) {
            logger.error('Error generating access token: ' + error, { className });
            throw error;
        }
    };

    public generateRefreshToken = (user: UserPayload): string => {
        try {
            logger.info('Generating refresh token for userId: ' + user.id, { className });
            const token = jwt.sign({ id: user.id, username: user.username, publicKey: user.publicKey }, refreshTokenSecret, { expiresIn: '2h' });
            logger.info('Refresh token generated successfully: ' + token, { className });
            return token;
        } catch (error) {
            logger.error('Error generating refresh token: ' + error, { className });
            throw error;
        }
    };

    public verifyAccessToken = async (token: string): Promise<JwtPayload | string> => {
        try {
            logger.info('Verifying access token: ' + token, { className });

            return jwt.verify(token, accessTokenSecret);
        } catch (error: any) {
            logger.error('Error verifying access token: ' + error, { className });

            if (error.name === 'TokenExpiredError') {
                return 'expired';
            } else {
                throw error;
            }
        }
    };

    public verifyRefreshToken = async (token: string): Promise<UserPayload | null> => {
        logger.info('Verifying refresh token: ' + token, { className });

        try {
            const decoded = jwt.verify(token, refreshTokenSecret) as UserPayload;
            const user = await UserModel.findUserByField("refreshToken", token);

            if (!user) {
                logger.error('Refresh token not found in the database', { className });
                return null;
            }

            return decoded;
        } catch (error: any) {
            if(error.name === 'TokenExpiredError'){
                logger.error('Refresh token expired', { className });
                throw new Error('Refresh token expired');
            }else{
                logger.error('Error verifying refresh token: ' + error, { className });
                throw error;
            }
        }
    };

}

export default new JwtService();
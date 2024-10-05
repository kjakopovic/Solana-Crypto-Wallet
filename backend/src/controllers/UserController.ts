// src/controllers/UserController.ts

import { Request, Response } from 'express';
import JwtService from "../services/JwtService";
import logger from '../config/Logger';
import UserService from "../services/UserService";

const className = 'UserController';

class UserController{

    async createUser(req: Request, res: Response): Promise<Response> {
        logger.info('Creating a new user', { className });
        const { imageUrl, password, publicKey } = req.body;

        if (!imageUrl || !password || !publicKey) {
            logger.error('Invalid input, imageUrl, password or publicKey is missing', { className });
            return res.status(400).json({ message: 'Invalid input, imageUrl, password or publicKey is missing' });
        }

        try {
            const user = await UserService.registerUser(imageUrl, password, publicKey);
            logger.info('User created successfully', { className });

            return res.status(201).json({
                message: 'User created successfully',
                refreshToken: user.refreshToken,
                accessToken: user.accessToken,
                username: user.username,
            });
        } catch (error) {
            logger.error({ message: 'Error creating user', error, className });
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    async updateUser(req: Request, res: Response) {
        logger.info('Updating user information', { className });
        const { publicKey } = req.params;
        const updates = req.body;

        if (!publicKey) {
            logger.error('Public key is required', { className });
            return res.status(400).json({ message: 'Public key is required' });
        }
        if(req.body.id || req.body.joinedAt || req.body.refreshToken || req.body.accessToken || req.body.points){
            logger.error('Invalid input, user not allowed to update given values!', { className });
            return res.status(400).json({ message: 'Invalid input, user not allowed to update given values!' });
        }

        try {
            await UserService.updateUser(publicKey, updates);
            logger.info('User updated successfully', { className });
            return res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            logger.error({ message: 'Error updating user', error, className });
            return res.status(500).json({ message: 'Error updating user' });
        }
    }

    async logoutUser(req: Request, res: Response) {
        const { publicKey } = req.body;

        if (!publicKey) {
            logger.error('Public key is required', { className });
            return res.status(400).json({ message: 'Public key is required' });
        }

        logger.info('Logging out user with publicKey: ' + publicKey, { className });

        try {
            logger.info('Deleting refresh token', { className, publicKey: publicKey });
            await UserService.deleteRefreshToken(publicKey);
            logger.info('User logged out successfully', { className });
            return res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            logger.error({ message: 'Error logging out user', error, className });
            return res.status(500).json({ message: 'Error logging out user: ' + error });
        }
    }

    async loginUser(req: Request, res: Response) {
        const { publicKey, password } = req.body;
        logger.info('Logging in user with publicKey: ' + publicKey, { className });

        if (!publicKey || !password){
            logger.error('PublicKey and password are required', { className });
            return res.status(400).json({ message: 'PublicKey and password are required' });
        }

        try{
            logger.info('Verifying user password', { className });
            const isPasswordValid = await UserService.verifyPassword(publicKey, password);
            if(!isPasswordValid){
                logger.error('Invalid password', { className });
                return res.status(401).json({ message: 'Invalid password' });
            }

            const user = await UserService.findUserByField('publicKey', publicKey);
            if(!user){
                logger.error('User not found', { className });
                return res.status(404).json({ message: 'User not found' });
            }

            try {
                logger.info('Generating refresh token', { className });
                const refreshToken = JwtService.generateRefreshToken(user);
                logger.info('Refresh token generated successfully: ' + refreshToken, { className });

                logger.info('Updating refresh token', { className, userId: user.id });
                await UserService.updateUser(publicKey, { refreshToken });
                logger.info('Refresh token updated successfully', { className, userId: user.id });

                logger.info('Generating access token', { className });
                const accessToken = JwtService.generateAccessToken({ id: user.id, username: user.username, publicKey: user.publicKey });
                logger.info('User logged in successfully', { className });

                return res.status(200).json({
                    username: user.username,
                    points: user.points ?? 0,
                    refreshToken,
                    accessToken
                });
            } catch (error) {
                logger.error({ message: 'Error generating tokens', error, className });
                return res.status(501).json({ message: 'Error generating tokens' });
            }
        }catch(error){
            logger.error({ message: 'Error logging in user', error, className });
            return res.status(500).json({ message: 'Error logging in user', error });
        }
    }

    async getUserInformation(req: Request, res: Response) {
        const publicKey = req.query.publicKey as string;

        if (!publicKey) {
            logger.error('Public key is required', {className});
            return res.status(400).json({message: 'Public key is required'});
        }

        logger.info('Getting user information for publicKey: ' + publicKey, {className});

        try {
            const result = await UserService.getUserInfo(publicKey);
            if (!result) {
                logger.error('User not found', {className});
                return res.status(404).json({message: 'User not found'});
            }

            logger.info('User information found', {className});
            return res.status(200).send(result);
        } catch (error) {
            logger.error({message: 'Error getting user information', error, className});
            return res.status(500).json({message: 'Error getting user information'});
        }
    }

    async getLeaderboard(req: Request, res: Response) {
        logger.info('Getting user points leaderboard', { className });
        const rank = req.body.rank as number;

        if (!rank) {
            logger.info("Rank not provided, fetching all users on leaderboard", { className });

            try{
                const result = await UserService.getAllPointsLeaderboard();
                logger.info('User points leaderboard found', { className });
                return res.status(200).send(result);
            }catch(error){
                logger.error({ message: 'Error getting user points leaderboard', error, className });
                return res.status(500).json({ message: 'Error getting user points leaderboard' });
            }
        }else if (rank >= 1){
            logger.info(`Getting ${rank} amount of users on leaderboard`, { className });

            try{
                const result = await UserService.getAmountOnLeaderboard(rank);
                logger.info('User points leaderboard found', { className });
                return res.status(200).send(result);
            }catch(error){
                logger.error({ message: 'Error getting user points leaderboard', error, className });
                return res.status(500).json({ message: 'Error getting user points leaderboard' });
            }
        }else{
            logger.error('Invalid input, rank must be a positive number', { className });
            return res.status(400).json({ message: 'Invalid input, rank must be a positive number' });
        }
    }

    async checkExistenceOfUserByUsername(req: Request, res: Response) {
        const username = req.query.username as string;

        if (!username) {
            logger.error('Username is required', { className });
            return res.status(400).json({ message: 'Username is required' });
        }

        logger.info('Getting user information for username: ' + username, { className });

        try {
            const result = await UserService.findUserByField('username', username);

            if (!result) {
                logger.error('User not found', { className });
                return res.status(200).json({ message: 'User not found, username is free to use.' });
            }

            logger.info('User information found', { className });
            return res.status(400).json({ message: 'User found, username is already taken.' });
        } catch (error) {
            logger.error({ message: 'Error getting user information', error, className });
            return res.status(500).json({ message: 'Error getting user information' });
        }
    }
}

export default new UserController();
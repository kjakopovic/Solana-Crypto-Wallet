// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { generateAccessToken, generateRefreshToken } from '../services/JwtService';
import logger from '../config/Logger';

const className = 'UserController';


// Register a new user
export const createUserController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Creating a new user', { className });
    const { password, publicKey } = req.body;

    try {
        //const publicKey = createWallet().publicKey;
        const user = await UserModel.createUserWithTokens(password, publicKey);
        logger.info('User created successfully', { className });

        return res.status(201).json({
            message: 'User created successfully',
            refreshToken: user.refreshToken,
            accessToken: user.accessToken
        });
    } catch (error) {
        logger.error({ message: 'Error creating user', error, className });
        return res.status(500).json({ message: 'Error creating user' });
    }
};

// Login user
export const loginUserController = async (req: Request, res: Response): Promise<Response> => {
    const { publicKey, password } = req.body;
    logger.info('Logging in user with publicKey: ' + publicKey, { className });

    if (!publicKey || !password){
        logger.error('Username and password are required', { className });
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try{
        logger.info('Verifying user password', { className });
        const isPasswordValid = await UserModel.verifyPassword(publicKey, password);
        if(!isPasswordValid){
            logger.error('Invalid password', { className });
            return res.status(401).json({ message: 'Invalid password' });
        }

        const user = await UserModel.findUserByPublicKey(publicKey);
        if(!user){
            logger.error('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }

        try {
            logger.info('Generating refresh token', { className });
            const refreshToken = generateRefreshToken(user);
            logger.info('Refresh token generated successfully: ' + refreshToken, { className });

            logger.info('Updating refresh token', { className, userId: user.id });
            //await UserModel.deleteRefreshToken(user.id);
            await UserModel.updateRefreshToken(user.id, refreshToken);
            logger.info('Refresh token updated successfully', { className, userId: user.id });

            logger.info('Generating access token', { className });
            const accessToken = generateAccessToken({ id: user.id, username: user.username });
            logger.info('User logged in successfully', { className });

            return res.status(200).json({
                id: user.id,
                username: user.username,
                publicKey: user.publicKey,
                refreshToken,
                accessToken
            });
        } catch (error) {
            logger.error({ message: 'Error generating tokens', error, className });
            return res.status(500).json({ message: 'Error generating tokens' });
        }
    }catch(error){
        logger.error({ message: 'Error logging in user', error, className });
        return res.status(500).json({ message: 'Error logging in user', error });
    }
};

// TODO: Check if maybe refreshToken is needed to logout user
// Logout user
export const logoutUserController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.body;
    logger.info('Logging out user with id: ' + id, { className });

    try {
        logger.info('Deleting refresh token', { className, userId: id });
        await UserModel.deleteRefreshToken(id);
        logger.info('User logged out successfully', { className });
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        logger.error({ message: 'Error logging out user', error, className });
        return res.status(500).json({ message: 'Error logging out user' });
    }
}

/********************************************************************************************************************/
/*  Fetching users  */

// Get user by public key
export const getUserByPublicKeyController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Fetching user by public key', { className });
    const { publicKey } = req.params;

    try {
        const user = await UserModel.findUserByPublicKey(publicKey);
        if (user) {
            logger.info('User fetched successfully', { className });
            return res.status(200).json(user);
        } else {
            logger.info('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error({ message: 'Error fetching user', error, className });
        return res.status(500).json({ message: 'Error fetching user' });
    }
}

// Get user by id
export const getUserByIdController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Fetching user by id', { className });
    const { id } = req.params;

    try {
        const user = await UserModel.findUserById(id);
        if (user) {
            logger.info('User fetched successfully', { className });
            return res.status(200).json(user);
        } else {
            logger.info('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error({ message: 'Error fetching user', error, className });
        return res.status(500).json({ message: 'Error fetching user' });
    }
};

/********************************************************************************************************************/

// Update user
export const updateUserController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Updating user information', { className });
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedUser = await UserModel.updateUser(id, updates);
        if (updatedUser) {
            logger.info('User updated successfully', { className });
            return res.status(200).json(updatedUser);
        } else {
            logger.info('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error({ message: 'Error updating user', error, className });
        return res.status(500).json({ message: 'Error updating user' });
    }
};

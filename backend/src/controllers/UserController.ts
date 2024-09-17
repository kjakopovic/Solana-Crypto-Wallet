// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { generateAccessToken, generateRefreshToken } from '../services/JwtService';
import { createWallet } from '../models/WalletModel';
import logger from '../config/Logger';

const className = 'UserController';


// Register a new user
export const createUserController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Creating a new user', { className });
    const { password } = req.body;

    try {
        const publicKey = createWallet().publicKey;
        const user = await UserModel.createUser(password, publicKey);
        logger.info('User created successfully', { className });
        return res.status(201).json({ message: 'User created successfully', user: user });
    } catch (error) {
        logger.error({ message: 'Error creating user', error, className });
        return res.status(500).json({ message: 'Error creating user' });
    }
};

// Get user by username
export const getUserByUsernameController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Fetching user by username', { className });
    const { username } = req.params;

    try {
        const user = await UserModel.findUserByUsername(username);
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

// Login user
export const loginUserController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Logging in user', { className });
    const { username, password } = req.body;

    if (!username || !password){
        logger.error('Username and password are required', { className });
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try{
        const isPasswordValid = await UserModel.verifyPassword(username, password);
        if(!isPasswordValid){
            logger.error('Invalid password', { className });
            return res.status(401).json({ message: 'Invalid password' });
        }

        const user = await UserModel.findUserByUsername(username);
        if(!user){
            logger.error('User not found', { className });
            return res.status(404).json({ message: 'User not found' });
        }

        const refreshToken = generateRefreshToken({ id: user.id, username: user.username, publicKey: user.publicKey });
        await UserModel.updateRefreshToken(user.id, refreshToken);

        const accessToken = generateAccessToken({ id: user.id, username: user.username });
        logger.info('User logged in successfully', { className });

        return res.status(200).json({
            id: user.id,
            username: user.username,
            publicKey: user.publicKey,
            refreshToken,
            accessToken
        });
    }catch(error){
        logger.error({ message: 'Error logging in user', error, className });
        return res.status(500).json({ message: 'Error logging in user', error });
    }
}
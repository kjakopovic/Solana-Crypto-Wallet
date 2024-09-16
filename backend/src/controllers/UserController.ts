// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
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
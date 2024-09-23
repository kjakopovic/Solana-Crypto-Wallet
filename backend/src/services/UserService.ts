// src/services/UserService.ts

import UserModel from "../models/UserModel";
import logger from '../config/Logger';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {promisify} from "node:util";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from './JwtService';

const className = 'UserService';
const readFile = promisify(fs.readFile);

class UserService{

    private generateRandomString(): string {
        const length = Math.floor(Math.random() * (32 - 16 + 1)) + 16;
        return crypto.randomBytes(length).toString('hex');
    }

    private async generateRandomUsername(): Promise<string> {
        logger.info('Generating a random username', { className });

        try {
            const attributesPath = path.join(__dirname, '../data/words/attributes.txt');
            const nounsPath = path.join(__dirname, '../data/words/nouns.txt');

            if(!fs.existsSync(attributesPath) || !fs.existsSync(nounsPath)){
                new Error('One or both word files were not found!');
            }

            const [attributes, nouns] = await Promise.all([
                readFile(attributesPath, 'utf-8'),
                readFile(nounsPath, 'utf-8')
            ]);

            const attributesArray = attributes.split('\n').map(word => word.trim());
            const nounsArray = nouns.split('\n').map(word => word.trim());

            let username = '';
            let isUnique = false;
            const maxAttempts = 50;
            let attempts = 0;

            while (!isUnique && attempts < maxAttempts) {
                const randomAttribute = attributesArray[Math.floor(Math.random() * attributesArray.length)];
                const randomNoun = nounsArray[Math.floor(Math.random() * nounsArray.length)];
                username = `${randomAttribute} ${randomNoun}`;

                const existingUser = await UserModel.findUserByField("username", username);
                if (!existingUser) {
                    isUnique = true;
                }
                attempts++;
            }

            if (!isUnique) {
                new Error('Failed to generate a unique username after multiple attempts');
            }

            return username;
        } catch (err) {
            logger.error('Error generating random username', { error: err, className });
            console.error('Error generating random username:', err);
            throw err;
        }
    }

    async registerUser(password: string, publicKey: string){
        logger.info('Registering user for publicKey: ' + publicKey, { className, publicKey });

        const id = this.generateRandomString();
        const username = await this.generateRandomUsername();
        const hashedPassword = await bcrypt.hash(password, 10);

        const refreshToken = generateRefreshToken({ id, username, publicKey });

        await UserModel.createUser(id, username, hashedPassword, publicKey, refreshToken);

        try {
            await verifyRefreshToken(refreshToken);
        }catch (error){
            logger.error('Error verifying refresh token', { error, className });
            throw new Error('Invalid refresh token');
        }

        const accessToken = generateAccessToken({ id, username });

        return { id, username, publicKey, refreshToken, accessToken };
    }

    async updateUser(publicKey: string, updates: Partial<any>){
        logger.info('Updating user information for publicKey: ' + publicKey, { className, publicKey });

        await UserModel.updateUser(publicKey, updates);
    }

    async deleteRefreshToken(publicKey: string){
        logger.info('Deleting user for publicKey: ' + publicKey, { className, publicKey });

        await UserModel.deleteRefreshToken(publicKey);
    }

    async verifyPassword(publicKey: string, password: string): Promise<boolean> {
        logger.info('Verifying password for publicKey: ' + publicKey, {className, publicKey});

        const user = await UserModel.findUserByField('publicKey', publicKey);
        if(!user){
            throw new Error('User not found');
        }
        return user ? bcrypt.compare(password, user.password) : false;
    }

    async findUserByField(field: string, value: string): Promise<any> {
        logger.info('Finding user by field: ' + field, { className, field, value });

        return UserModel.findUserByField(field, value);
    }

    async updateUserPoints(userId: string, points: number){
        logger.info('Updating user points for userId: ' + userId, { className, userId });

        return UserModel.updateUserPoints(userId, points);
    }
}

export default new UserService();
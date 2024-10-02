// src/services/UserService.ts

import UserModel from "../models/UserModel";
import logger from '../config/Logger';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {promisify} from "node:util";
import JwtService from "./JwtService";

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

    async registerUser(imageUrl: string, password: string, publicKey: string){
        logger.info('Registering user for publicKey: ' + publicKey, { className, publicKey });

        if(!imageUrl || !password || !publicKey){
            logger.error('Missing required fields', { className });
            throw new Error('Missing required fields');
        }

        const id = this.generateRandomString();
        const username = await this.generateRandomUsername();
        const hashedPassword = await bcrypt.hash(password, 10);

        const refreshToken = JwtService.generateRefreshToken({ id, username, publicKey });

        await UserModel.createUser(id, username, imageUrl,hashedPassword, publicKey, refreshToken);

        try {
            await JwtService.verifyRefreshToken(refreshToken);
        }catch (error){
            logger.error('Error verifying refresh token', { error, className });
            throw new Error('Invalid refresh token');
        }

        const accessToken = JwtService.generateAccessToken({ id, username, publicKey });

        return { id, username, imageUrl, publicKey, refreshToken, accessToken };
    }

    async updateUser(publicKey: string, updates: Partial<any>){
        logger.info('Updating user information for publicKey: ' + publicKey, { className, publicKey });

        const user = await UserModel.findUserByField('publicKey', publicKey);
        if(!user){
            logger.error('User not found', { className });
            throw new Error('User not found');
        }

        await UserModel.updateUser(publicKey, updates);

        const userAfterUpdate = await UserModel.findUserByField('publicKey', publicKey);

        if(!userAfterUpdate){
            logger.error('User not found after update', { className });
            throw new Error('User not found after update');
        }
        if(user == userAfterUpdate){
            logger.error('User not updated', { className });
            throw new Error('User not updated');
        }
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

        if(await UserModel.findUserByField('id', userId) == null){
            logger.error('User not found', { className });
            throw new Error('User not found');
        }

        return UserModel.updateUserPoints(userId, points);
    }

    async getUserInfo(publicKey: string){
        logger.info('Getting user info for publicKey: ' + publicKey, { className, publicKey });
        const user = await UserModel.findUserByField('publicKey', publicKey);

        if(user){
            return {
                username: user.username,
                imageUrl: user.imageUrl,
                publicKey: user.publicKey,
                joinedAt: user.joinedAt,
                points: user.points,
            };
        }
        return null;
    }

    async getAllPointsLeaderboard(){
        logger.info('Getting user points leaderboard', { className });
        const leaderboard = await UserModel.getAllPointsLeaderboard();

        if(!leaderboard){
            logger.error('Error getting leaderboard', { className });
            throw new Error('Error getting leaderboard');
        }

        return leaderboard;
    }

    async getAmountOnLeaderboard(rank: number){
        logger.info('Getting user points leaderboard', { className });
        const leaderboard = await UserModel.getAmountOnLeaderboard(rank);

        if(!leaderboard){
            logger.error('Error getting leaderboard', { className });
            throw new Error('Error getting leaderboard');
        }

        return leaderboard;
    }
}

export default new UserService();
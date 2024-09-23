// src/models/UserModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'UserModel';

export interface User{
    id: string;
    username: string;
    password: string;
    publicKey: string;
    refreshToken: string;
}

class UserModel {
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    // Insert a new user into the users table
    public async createUser(id: string, username:string, hashedPassword: string,  publicKey: string, refreshToken: string): Promise<void> {
        logger.info('Creating a new user', { className });
        const sqlQuery = `
            INSERT INTO users (id, username, password, publicKey, refreshToken)
            VALUES (@id, @username, @password, @publicKey, @refreshToken);
            `;

        try {

            await this.db.request()
                .input('id', id)
                .input('username', username)
                .input('password', hashedPassword)
                .input('publicKey', publicKey)
                .input('refreshToken', refreshToken)
                .query(sqlQuery);

            logger.info('User created successfully', { className });
            console.log(`User ${username} created successfully.`);

        } catch (err) {
            logger.error('Error creating user', { error: err, className });
            throw err;
        }
    }

    // Update user information
    async updateUser(publicKey: string, updates: Partial<User>): Promise<void> {
        logger.info('Updating user information', { className });

        const updateFields = Object.keys(updates).map(field => `${field} = @${field}`).join(', ');
        const request = this.db.request().input('publicKey', publicKey);

        Object.entries(updates).forEach(([key, value]) => {
            request.input(key, value);
        });

        const sqlQuery = `
            UPDATE users
            SET ${updateFields}
            WHERE publicKey = @publicKey;
        `;

        try{
            await request.query(sqlQuery);
            logger.info('User information updated successfully', { className });
        }catch(err){
            logger.error('Error updating user information: ' + err, { error: err, className });
            throw err;
        }
    }

    // TODO: Implement this in UserService
    async findUserByField(field: string, value: string): Promise<User | null>{
        logger.info(`Fetching user by ${field}`, { className });
        const sqlQuery = `SELECT * FROM users WHERE ${field} = @${field}`;

        try {
            const result = await this.db.request()
                .input(field, value)
                .query(sqlQuery);

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                logger.info('User fetched successfully, returning json with information', { className });
                return {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    publicKey: user.publicKey,
                    refreshToken: user.refreshToken,
                };
            } else {
                logger.info('User not found', { className });
                return null;
            }
        } catch (err) {
            logger.error(`Error fetching user by ${field}`, { error: err, className });
            console.error(`Error fetching user by ${field}:`, err);
            return null;
        }
    }

    async deleteRefreshToken(publicKey: string): Promise<void>{
        logger.info('Deleting refresh token for publicKey: ' + publicKey, { className, publicKey });
        const sqlQuery = `
            UPDATE users
            SET refreshToken = null
            WHERE publicKey = @publicKey;
        `;

        try{
            await this.db.request()
                .input('publicKey', publicKey)
                .query(sqlQuery);
            logger.info('Refresh token deleted successfully', { className });
        }catch(err){
            logger.error('Error deleting refresh token', { error: err, className });
            throw err;
        }

    }

    public async updateUserPoints(userId: string, points: number): Promise<void> {
        logger.info('Updating user points for user: ' + userId, { className });
        const sqlQuery = `
            UPDATE users
            SET dailyQuizPoints = ISNULL(dailyQuizPoints, 0) + @points
            WHERE id = @userId;
        `;

        try{
            await this.db.request()
                .input('userId', userId)
                .input('points', points)
                .query(sqlQuery);
            logger.info('User points updated successfully', { className });
        }catch(err){
            logger.error('Error updating user points: ' + err, { error: err, className });
            throw err;
        }

    }
}

export default new UserModel();

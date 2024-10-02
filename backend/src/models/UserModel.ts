// src/models/UserModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'UserModel';

export interface User{
    id: string;
    username: string;
    imageUrl: string;
    password: string;
    publicKey: string;
    joinedAt: Date;
    refreshToken: string;
    points?: number;
}

interface UserPointsLeaderboard{
    placement: number;
    username: string;
    imageUrl: string;
    publicKey: string;
    points: number;
}

class UserModel {
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    // Insert a new user into the users table
    public async createUser(id: string, username:string, imageUrl:string, hashedPassword: string,  publicKey: string, refreshToken: string): Promise<void> {
        logger.info('Creating a new user', { className });

        // Query to insert a new user into the users table
        const sqlQuery = `
            INSERT INTO users (id, username, imageUrl, password, publicKey, refreshToken)
            VALUES (@id, @username, @imageUrl, @password, @publicKey, @refreshToken);
            `;

        try {

            await this.db.request()
                .input('id', id)
                .input('username', username)
                .input('imageUrl', imageUrl)
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

        // Query to update user information for a specific field in the users table of a given user
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

    // Fetch a user by a specific field
    async findUserByField(field: string, value: string): Promise<User | null> {
        logger.info(`Fetching user by ${field}`, { className });

        // Query to fetch a user by a specific field in the users table
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
                    imageUrl: user.imageUrl,
                    password: user.password,
                    publicKey: user.publicKey,
                    joinedAt: user.joinedAt,
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

    // Delete users refresh token
    async deleteRefreshToken(publicKey: string): Promise<void>{
        logger.info('Deleting refresh token for publicKey: ' + publicKey, { className, publicKey });

        // Query that sets the refresh token to null for a specific user in the users table
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

    // Update users points
    async updateUserPoints(userId: string, points: number): Promise<void> {
        logger.info('Updating user points for user: ' + userId, { className });

        // Query to update the points for a specific user in the users table
        const sqlQuery = `
            UPDATE users
            SET points = ISNULL(points, 0) + @points
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

    async getUserInfo(publicKey: string): Promise<User | null>{
        logger.info('Getting user info for publicKey: ' + publicKey, { className });
        const user = await this.findUserByField('publicKey', publicKey);
        if(user){
            logger.info('User info found, returning user info', { className });
            return user;
        }else{
            logger.info('User info not found', { className });
            return null;
        }
    }

    async getAllPointsLeaderboard(): Promise<UserPointsLeaderboard[] | null> {
        logger.info('Getting points leaderboard', { className });

        // Query to fetch all users on the leaderboard from the users table
        const sqlQuery = `
        SELECT CAST(DENSE_RANK() OVER (ORDER BY points DESC, username ASC) AS INT) AS placement,
            username, imageUrl, publicKey, CAST(points AS INT) AS points
        FROM users
        WHERE points IS NOT NULL;
        `;

        try{
            const result = await this.db.request().query(sqlQuery);
            const leaderboard: UserPointsLeaderboard[] = result.recordset;
            logger.info('Points leaderboard fetched successfully', { className });

            return leaderboard;
        }catch (err){
            logger.error('Error fetching points leaderboard: ' + err, { error: err, className });
            throw err;
        }
    }

    async getAmountOnLeaderboard(rank: number): Promise<UserPointsLeaderboard[] | null> {
        logger.info(`Getting ${rank} amount of users on leaderboard`, { className });

        // Query to fetch a specific amount of users on the leaderboard from the users table
        const sqlQuery = `
        WITH RankedUsers AS (
            SELECT CAST(DENSE_RANK() OVER (ORDER BY points DESC, username ASC) AS INT) AS placement,
                username, imageUrl, publicKey, CAST(points AS INT) AS points
            FROM users
            WHERE points IS NOT NULL
        )
        SELECT *
        FROM RankedUsers
        WHERE placement <= @rank;
    `;

        try{
            const result = await this.db.request()
                .input('rank', rank)
                .query(sqlQuery);
            const leaderboard: UserPointsLeaderboard[] = result.recordset;
            logger.info('Fetched users from leaderboard successfully', { className });

            return leaderboard;
        }catch(err){
            logger.error('Error fetching users from leaderboard: ' + err, { error: err, className });
            throw err;
        }
    }

}

export default new UserModel();

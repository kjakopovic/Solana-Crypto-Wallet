// src/models/UserModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/Database';
import logger from '../config/Logger';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {promisify} from "node:util";
import { generateAccessToken, generateRefreshToken } from '../services/JwtService';

const className = 'UserModel';
const readFile = promisify(fs.readFile);

interface User{
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

    /************************************************************************************************/
    /* Random generators */

    private generateRandomString(): string {
        const length = Math.floor(Math.random() * (32 - 16 + 1)) + 16;
        return crypto.randomBytes(length).toString('hex');
    }

    private async generateRandomUsername(): Promise<string> {
        logger.info('Generating a random username', { className });

        try {
            const attributesPath = path.join(__dirname, '../../words/attributes.txt');
            const nounsPath = path.join(__dirname, '../../words/nouns.txt');

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

                const existingUser = await this.findUserByUsername(username);
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


    /************************************************************************************************/
    /* Basic CRUD operations */

    // Check if the users table exists in the database
    /*async checkAndCreateTable(): Promise<void> {
        logger.info('Checking if users table exists in the database', { className });

        try {
            const result = await this.db.query(`
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
                BEGIN
                    CREATE TABLE users (
                        id NVARCHAR(255) PRIMARY KEY,
                        username NVARCHAR(50) NOT NULL UNIQUE,
                        password NVARCHAR(255) NOT NULL,
                        publicKey NVARCHAR(255),
                        refreshToken NVARCHAR(255) 
                    );
                END;
            `);

            if (result) {
                logger.info('Table users checked and created if not present', { className });
                console.log("Table 'users' checked and created if not present.");
            }
        } catch (err) {
            logger.error('Error checking or creating users table', { error: err, className });
            console.error("Error checking or creating users table:", err);
        }

    }*/

    public async createUserWithTokens(password: string, receivedPublicKey: string): Promise<{ id:string, username:string, publicKey:string, refreshToken:string, accessToken: string }> {
        logger.info('Creating a new user with tokens', { className });

        try {
            const user = await this.createUser(password, receivedPublicKey);

            // Generate access token
            const accessToken = generateAccessToken({ id: user.id, username: user.username });
            const id = user.id;
            const username = user.username;
            const refreshToken = user.refreshToken;
            const publicKey = user.publicKey;

            return { id, username, publicKey, refreshToken, accessToken };
        } catch (err) {
            logger.error('Error creating user with tokens', { error: err, className });
            throw err;
        }
    }


    // Insert a new user into the users table
    private async createUser(password: string, publicKey: string): Promise<User> {
        logger.info('Creating a new user', { className });

        try {
            const id = this.generateRandomString();
            const username = await this.generateRandomUsername();
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

            const refreshToken = generateRefreshToken({ id, username, publicKey });

            await this.db.request()
                .input('id', id)
                .input('username', username)
                .input('password', hashedPassword)
                .input('publicKey', publicKey)
                .input('refreshToken', refreshToken)
                .query(`
                    INSERT INTO users (id, username, password, publicKey, refreshToken)
                    VALUES (@id, @username, @password, @publicKey, @refreshToken);
                `);
            logger.info('User created successfully', { className });
            console.log(`User ${username} created successfully.`);

            return {
                id,
                username,
                password: 'hashed',
                publicKey,
                refreshToken,
            };
        } catch (err) {
            logger.error('Error creating user', { error: err, className });
            console.error("Error creating user:", err);
            throw err;
        }
    }

    // Update user information
    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        logger.info('Updating user information', { className });

        try {
            const user = await this.findUserById(id);
            if(!user){
                logger.info('User not found', { className });
                return null;
            }

            const updateFields = Object.keys(updates).map(field => `${field} = @${field}`).join(', ');
            const request = this.db.request().input('id', id);

            Object.entries(updates).forEach(([key, value]) => {
                request.input(key, value);
            });

            const result = await request.query(`
            UPDATE users
            SET ${updateFields}
            WHERE id = @id;
            SELECT * FROM users WHERE id = @id;
        `);

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                logger.info('User updated successfully', { className });
                return {
                    id: user.id,
                    username: user.username,
                    password: "hashed",
                    publicKey: user.publicKey,
                    refreshToken: user.refreshToken,
                };
            } else {
                logger.info('User not found after update', { className });
                return null;
            }
        } catch (err) {
            logger.error('Error updating user', { error: err, className });
            console.error("Error updating user:", err);
            throw err;
        }
    }


    /************************************************************************************************/
    /* Find operations */

    // Find a user by a given field
    private async findUserByField(field: string, value: string): Promise<User | null> {
        logger.info(`Fetching user by ${field}`, { className });

        try {
            const result = await this.db.request()
                .input(field, value)
                .query(`SELECT * FROM users WHERE ${field} = @${field}`);

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

    async findUserByUsername(username: string): Promise<User | null> {
        return this.findUserByField('username', username);
    }

    async findUserById(id: string): Promise<User | null> {
        return this.findUserByField('id', id);
    }

    async findUserByPublicKey(publicKey: string): Promise<User | null> {
        return this.findUserByField('publicKey', publicKey);
    }

    async findUserByRefreshToken(id:string, refreshToken: string): Promise<User | null> {
        logger.info('Fetching user by refreshToken', { className });
        const sqlQuery = `
            SELECT * FROM users
            WHERE id = @id AND refreshToken = @refreshToken;
        `;


        try {
            const request = this.db.request();
            request.input('id', id);
            request.input('refreshToken', refreshToken);

            const result = await request.query(sqlQuery);

            logger.info('User fetched successfully, returning json with information', { className });
            return result.recordset[0];
        } catch (err) {
            logger.error('Error fetching user by refreshToken', { error: err, className });
            throw new Error('Error querying the database: ' + err);
        }
    }

    /************************************************************************************************/

    public async verifyPassword(publicKey: string, password: string): Promise<boolean> {
        const user = await this.findUserByPublicKey(publicKey);

        if(!user){
            return false;
        }

        return bcrypt.compare(password, user.password);
    }

    public async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
        logger.info('Updating refresh token for id: ' + id, { className, id });
        logger.info('New refresh token: ' + refreshToken);

        const sqlQuery = `
        UPDATE users
        SET refreshToken = @refreshToken
        WHERE id = @id;
        `;

        logger.info('Generated SQL Query:', sqlQuery);  // Log the query for debugging

        try {
            const request = this.db.request();
            request.input('id', id);
            request.input('refreshToken', refreshToken);

            const result = await request.query(sqlQuery);

            if (result.rowsAffected[0] > 0) {
                logger.info('Refresh token updated successfully');
            } else {
                logger.warn('No rows were updated');
            }
        } catch (err) {
            logger.error('Error updating refresh token', { error: err, className });
            throw err;
        }
    }

    public async deleteRefreshToken(publicKey: string): Promise<void> {
        logger.info('Deleting refresh token for publicKey: ' + publicKey, {className, publicKey});

        const checkRefreshToken = `
        SELECT 1
        FROM users
        WHERE publicKey = @publicKey AND refreshToken IS NOT NULL;
        `;

        try {
            const checkRequest = this.db.request();
            checkRequest.input('publicKey', publicKey);

            const checkResult = await checkRequest.query(checkRefreshToken);

            if (checkResult.recordset.length === 0) {
                logger.error('No refresh token found for publicKey: ' + publicKey, {className});
                throw new Error('Unable to logout user, no refresh token found for publicKey: ' + publicKey);
            }

            const sqlQuery = `
            UPDATE users
            SET refreshToken = null
            WHERE publicKey = @publicKey;
            `;

            logger.info('Generated SQL Query: \n' + sqlQuery, {className});

            try {
                const request = this.db.request();
                request.input('publicKey', publicKey);

                const result = await request.query(sqlQuery);

                if (result.rowsAffected[0] > 0) {
                    logger.info('Refresh token deleted successfully');
                } else {
                    logger.warn('No rows were updated');
                }
            } catch (err) {
                logger.error('Error deleting refresh token', {error: err, className});
                throw new Error('Error deleting refresh token');
            }

        } catch (err) {
            logger.error('Error checking refresh token: ' + err, {error: err, className});
            throw err;
        }
    }
}

export default new UserModel();

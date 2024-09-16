// src/models/UserModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/Database';
import logger from '../config/Logger';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const className = 'UserModel';


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

    private generateRandomString(): string {
        const length = Math.floor(Math.random() * (32 - 16 + 1)) + 16;
        return crypto.randomBytes(length).toString('hex');
    }

    // Check if the users table exists in the database
    async checkAndCreateTable(): Promise<void> {
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

    }

    // Insert a new user into the users table
    async createUser(user: User): Promise<void> {
        logger.info('Creating a new user', { className });

        try {
            const id = this.generateRandomString();
            const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password with a salt round of 10
            await this.db.request()
                .input('id', id)
                .input('username', user.username)
                .input('password', hashedPassword)
                .input('publicKey', user.publicKey)
                .query(`
                    INSERT INTO users (id, username, password, publicKey)
                    VALUES (@id, @username, @password, @publicKey);
                `);
            logger.info('User created successfully', { className });
            console.log(`User ${user.username} created successfully.`);
        } catch (err) {
            logger.error('Error creating user', { error: err, className });
            console.error("Error creating user:", err);
        }
    }

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
}

export default new UserModel();

// backend/tests/unit/JwtService.test.ts

import * as jwt from 'jsonwebtoken';
import JwtService from '../../src/services/JwtService';
import logger from '../../src/config/Logger';
import UserModel from '../../src/models/UserModel';

jest.mock('jsonwebtoken');
jest.mock('../../src/config/Logger');
jest.mock('../../src/models/UserModel');

const userPayload = {
    id: '123',
    username: 'testuser',
    publicKey: 'testpublickey'
};

describe('JwtService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    });

    describe('generateAccessToken', () => {
        it('should generate an access token', () => {
            const token = 'testaccesstoken';
            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = JwtService.generateAccessToken(userPayload);

            expect(jwt.sign).toHaveBeenCalledWith({ id: userPayload.id, username: userPayload.username }, expect.any(String), { expiresIn: '5m' });
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generating access token'), { className: 'JwtService' });
            expect(result).toBe(token);
        });

        it('should log an error and throw if token generation fails', () => {
            const error = new Error('Token generation failed');
            (jwt.sign as jest.Mock).mockImplementation(() => { throw error; });

            expect(() => JwtService.generateAccessToken(userPayload)).toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error generating access token'), { className: 'JwtService' });
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token', () => {
            const token = 'testrefreshtoken';
            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = JwtService.generateRefreshToken(userPayload);

            expect(jwt.sign).toHaveBeenCalledWith({ id: userPayload.id, username: userPayload.username, publicKey: userPayload.publicKey }, expect.any(String), { expiresIn: '2h' });
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generating refresh token'), { className: 'JwtService' });
            expect(result).toBe(token);
        });

        it('should log an error and throw if token generation fails', () => {
            const error = new Error('Token generation failed');
            (jwt.sign as jest.Mock).mockImplementation(() => { throw error; });

            expect(() => JwtService.generateRefreshToken(userPayload)).toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error generating refresh token'), { className: 'JwtService' });
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify an access token', () => {
            const token = 'testaccesstoken';
            const decoded = { id: '123', username: 'testuser' };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);

            const result = JwtService.verifyAccessToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Verifying access token'), { className: 'JwtService' });
            expect(result).toBe(decoded);
        });

        it('should log an error and throw if token verification fails', () => {
            const token = 'testaccesstoken';
            const error = new Error('Token verification failed');
            (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });

            expect(() => JwtService.verifyAccessToken(token)).toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error verifying access token'), { className: 'JwtService' });
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify a refresh token and return the decoded payload', async () => {
            const token = 'testrefreshtoken';
            const decoded = { id: '123', username: 'testuser', publicKey: 'testpublickey' };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            (UserModel.findUserByField as jest.Mock).mockResolvedValue(userPayload);

            const result = await JwtService.verifyRefreshToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
            expect(UserModel.findUserByField).toHaveBeenCalledWith('refreshToken', token);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Verifying refresh token'), { className: 'JwtService' });
            expect(result).toBe(decoded);
        });

        it('should return null if user is not found in the database', async () => {
            const token = 'testrefreshtoken';
            const decoded = { id: '123', username: 'testuser', publicKey: 'testpublickey' };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            (UserModel.findUserByField as jest.Mock).mockResolvedValue(null);

            const result = await JwtService.verifyRefreshToken(token);

            expect(result).toBeNull();
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Refresh token not found in the database'), { className: 'JwtService' });
        });

        it('should log an error and throw if token verification fails', async () => {
            const token = 'testrefreshtoken';
            const error = new Error('Token verification failed');
            (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });

            await expect(JwtService.verifyRefreshToken(token)).rejects.toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error verifying refresh token'), { className: 'JwtService' });
        });
    });
});
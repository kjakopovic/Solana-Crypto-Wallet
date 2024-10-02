import request from 'supertest';
import express from 'express';
import ChallengeRoutes from '../../src/routes/ChallengeRoutes';
import ChallengeService from '../../src/services/ChallengeService';
import logger from '../../src/config/Logger';
import authMiddleware from '../../src/middleware/AuthMiddleware';

// Mock the necessary modules
jest.mock('../../src/services/ChallengeService');
jest.mock('../../src/config/Logger');

// Mock the authentication middleware to bypass authentication
jest.mock('../../src/middleware/AuthMiddleware', () => {
    return jest.fn((req, res, next) => {
        next(); // Call next to allow the request to proceed
    });
});

// Create an Express application for testing
const app = express();
app.use(express.json());
app.use('/challenges', ChallengeRoutes);

describe('ChallengeController Integration Test', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    afterAll(async () => {
        // Optional: If you have cleanup tasks
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    });

    it('should return all challenges successfully', async () => {
        const mockChallenges = [{ id: 1, name: 'Challenge 1' }, { id: 2, name: 'Challenge 2' }];
        (ChallengeService.getAllChallenges as jest.Mock).mockResolvedValue(mockChallenges);

        // Create a mock token for authentication
        const token = 'your_mock_token'; // Replace with actual token logic if needed

        const response = await request(app)
            .get('/challenges/get-all')
            .set('Authorization', `Bearer ${token}`); // Set the Authorization header

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockChallenges);
        expect(logger.info).toHaveBeenCalledWith('Getting all challenges', { className: 'ChallengeController' });
    });

    it('should return 500 if there is an error', async () => {
        (ChallengeService.getAllChallenges as jest.Mock).mockRejectedValue(new Error('Error getting challenges'));

        const token = 'your_mock_token'; // Replace with actual token logic if needed

        const response = await request(app)
            .get('/challenges/get-all')
            .set('Authorization', `Bearer ${token}`); // Set the Authorization header

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Error getting challenges' });
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error getting challenges'), expect.any(Object));
    });
});

// tests/unit/ChallengeService.test.ts

import ChallengeService from '../../src/services/ChallengeService';

jest.mock('../../src/services/ChallengeService', () => {
    return {
        getAllChallenges: jest.fn(),
    };
});

describe('ChallengeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get all challenges', async () => {
        const userId = 'testUserId';
        const mockChallenges = [{ id: 1, name: 'Challenge 1' }];
        (ChallengeService.getAllChallenges as jest.Mock).mockResolvedValue(mockChallenges);

        const result = await ChallengeService.getAllChallenges(userId);
        expect(result).toBeDefined();
        expect(result).toEqual(mockChallenges);
    });

    it('should throw an error if getting challenges fails', async () => {
        const userId = 'testUserId';
        (ChallengeService.getAllChallenges as jest.Mock).mockRejectedValue(new Error('Error getting challenges'));

        await expect(ChallengeService.getAllChallenges(userId)).rejects.toThrow('Error getting challenges');
    });
});
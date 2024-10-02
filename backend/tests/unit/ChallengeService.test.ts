// tests/unit/ChallengeService.test.ts

import ChallengeService from '../../src/services/ChallengeService';

jest.mock('../../src/services/ChallengeService', () =>{
    return {
        getAllChallenges: jest.fn(),
    };
});

describe('ChallengeService', () => {
   beforeEach(() => {
       jest.clearAllMocks();
   });

    it('should get all challenges successfully', async () => {
        const mockChallenges = [{ id: 1, name: 'Test Challenge' }];
        (ChallengeService.getAllChallenges as jest.Mock).mockResolvedValue(mockChallenges);

        const result = await ChallengeService.getAllChallenges();

        expect(result).toEqual(mockChallenges);
        expect(ChallengeService.getAllChallenges).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when getting all challenges fails', async () => {
        (ChallengeService.getAllChallenges as jest.Mock).mockRejectedValue(new Error('Error getting challenges'));

        await expect(ChallengeService.getAllChallenges()).rejects.toThrow('Error getting challenges');
        expect(ChallengeService.getAllChallenges).toHaveBeenCalledTimes(1);
    });


});
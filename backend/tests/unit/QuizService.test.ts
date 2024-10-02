// tests/unit/QuizService.test.ts

import QuizService from '../../src/services/QuizService';

jest.mock('../../src/services/QuizService', () => {
    return {
        getRandomQuiz: jest.fn(),
    };
});

describe('QuizService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get a random quiz successfully', async () => {
        const mockQuiz = { id: 1, name: 'Test Quiz', difficulty: 'easy' };
        (QuizService.getRandomQuiz as jest.Mock).mockResolvedValue(mockQuiz);

        const result = await QuizService.getRandomQuiz('easy');

        expect(result).toEqual(mockQuiz);
        expect(QuizService.getRandomQuiz).toHaveBeenCalledWith('easy');
        expect(QuizService.getRandomQuiz).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when getting a random quiz fails', async () => {
        (QuizService.getRandomQuiz as jest.Mock).mockRejectedValue(new Error('Error getting quiz'));

        await expect(QuizService.getRandomQuiz('easy')).rejects.toThrow('Error getting quiz');
        expect(QuizService.getRandomQuiz).toHaveBeenCalledWith('easy');
        expect(QuizService.getRandomQuiz).toHaveBeenCalledTimes(1);
    });
});
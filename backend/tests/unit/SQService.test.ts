// tests/unit/SQService.test.ts

import SupportQuestionService from "../../src/services/SupportQuestionService";

jest.mock("../../src/services/SupportQuestionService", () => {
    return {
        createSupportQuestion: jest.fn(),
        answerSupportQuestion: jest.fn(),
        fetchSupportQuestionByField: jest.fn(),
        fetchAllSupportQuestions: jest.fn(),
    };
});

describe("SupportQuestionService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createSupportQuestion', () => {
        it('should create a support question successfully', async () => {
            const mockCreateSupportQuestion = jest.fn().mockResolvedValue(undefined);
            (SupportQuestionService.createSupportQuestion as jest.Mock).mockImplementation(mockCreateSupportQuestion);

            await SupportQuestionService.createSupportQuestion('testPublicKey', 'testQuestion', 'testDescription');

            expect(mockCreateSupportQuestion).toHaveBeenCalledWith('testPublicKey', 'testQuestion', 'testDescription');
        });

        it('should throw an error when creating a support question fails', async () => {
            const mockCreateSupportQuestion = jest.fn().mockRejectedValue(new Error('Error creating support question'));
            (SupportQuestionService.createSupportQuestion as jest.Mock).mockImplementation(mockCreateSupportQuestion);

            await expect(SupportQuestionService.createSupportQuestion('testPublicKey', 'testQuestion', 'testDescription')).rejects.toThrow('Error creating support question');
        });
    });

    describe('answerSupportQuestion', () => {
        it('should answer a support question successfully', async () => {
            const mockAnswerSupportQuestion = jest.fn().mockResolvedValue(undefined);
            (SupportQuestionService.answerSupportQuestion as jest.Mock).mockImplementation(mockAnswerSupportQuestion);

            await SupportQuestionService.answerSupportQuestion(1, 'testAnswer');

            expect(mockAnswerSupportQuestion).toHaveBeenCalledWith(1, 'testAnswer');
        });

        it('should throw an error when answering a support question fails', async () => {
            const mockAnswerSupportQuestion = jest.fn().mockRejectedValue(new Error('Error answering support question'));
            (SupportQuestionService.answerSupportQuestion as jest.Mock).mockImplementation(mockAnswerSupportQuestion);

            await expect(SupportQuestionService.answerSupportQuestion(1, 'testAnswer')).rejects.toThrow('Error answering support question');
        });
    });

    describe('fetchSupportQuestionByField', () => {
        it('should fetch a support question by field successfully', async () => {
            const mockQuestion = { id: 1, question: 'testQuestion' };
            const mockFetchSupportQuestionByField = jest.fn().mockResolvedValue(mockQuestion);
            (SupportQuestionService.fetchSupportQuestionByField as jest.Mock).mockImplementation(mockFetchSupportQuestionByField);

            const result = await SupportQuestionService.fetchSupportQuestionByField('id', '1');

            expect(result).toEqual(mockQuestion);
            expect(mockFetchSupportQuestionByField).toHaveBeenCalledWith('id', '1');
        });

        it('should throw an error when fetching a support question by field fails', async () => {
            const mockFetchSupportQuestionByField = jest.fn().mockRejectedValue(new Error('Error getting support question'));
            (SupportQuestionService.fetchSupportQuestionByField as jest.Mock).mockImplementation(mockFetchSupportQuestionByField);

            await expect(SupportQuestionService.fetchSupportQuestionByField('id', '1')).rejects.toThrow('Error getting support question');
        });
    });

    describe('fetchAllSupportQuestions', () => {
        it('should fetch all support questions successfully', async () => {
            const mockQuestions = [{ id: 1, question: 'testQuestion' }];
            const mockFetchAllSupportQuestions = jest.fn().mockResolvedValue(mockQuestions);
            (SupportQuestionService.fetchAllSupportQuestions as jest.Mock).mockImplementation(mockFetchAllSupportQuestions);

            const result = await SupportQuestionService.fetchAllSupportQuestions();

            expect(result).toEqual(mockQuestions);
            expect(mockFetchAllSupportQuestions).toHaveBeenCalledTimes(1);
        });

        it('should throw an error when fetching all support questions fails', async () => {
            const mockFetchAllSupportQuestions = jest.fn().mockRejectedValue(new Error('Error fetching support questions'));
            (SupportQuestionService.fetchAllSupportQuestions as jest.Mock).mockImplementation(mockFetchAllSupportQuestions);

            await expect(SupportQuestionService.fetchAllSupportQuestions()).rejects.toThrow('Error fetching support questions');
        });
    });
});
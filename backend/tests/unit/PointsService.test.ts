// tests/unit/PointsService.test.ts

import PointsService from "../../src/services/PointsService";
jest.mock('../../src/services/PointsService', () =>{
    return {
        savePointsChallenge: jest.fn(),
        savePointsQuiz: jest.fn(),
    };
});

describe('PointsService', () => {
   beforeEach(() => {
       jest.clearAllMocks();
   });

   describe('savePointsChallenge', () => {
       it('should save points for a challenge successfully', async () => {
              (PointsService.savePointsChallenge as jest.Mock).mockResolvedValue(undefined);
              await PointsService.savePointsChallenge('123', 1);
              expect(PointsService.savePointsChallenge).toHaveBeenCalledTimes(1);
       });

       it('should throw an error when saving points for a challenge fails', async () => {
                (PointsService.savePointsChallenge as jest.Mock).mockRejectedValue(new Error('Error saving points'));
                await expect(PointsService.savePointsChallenge('123', 1)).rejects.toThrow('Error saving points');
                expect(PointsService.savePointsChallenge).toHaveBeenCalledTimes(1);
       });
   });

   describe('savePointsQuiz', () => {
         it('should save points for a quiz successfully', async () => {
                  (PointsService.savePointsQuiz as jest.Mock).mockResolvedValue(undefined);
                  await PointsService.savePointsQuiz('123', 'Easy');
                  expect(PointsService.savePointsQuiz).toHaveBeenCalledTimes(1);
         });

         it('should throw an error when saving points for a quiz fails', async () => {
                 (PointsService.savePointsQuiz as jest.Mock).mockRejectedValue(new Error('Error saving points'));
                 await expect(PointsService.savePointsQuiz('123', 'Easy')).rejects.toThrow('Error saving points');
                 expect(PointsService.savePointsQuiz).toHaveBeenCalledTimes(1);
         });
   });
});
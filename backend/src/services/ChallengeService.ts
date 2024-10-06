// src/service/ChallengeService.ts

import logger from '../config/Logger';
import ChallengeModel from '../models/ChallengeModel';
import PointsModel from '../models/PointsModel';

const className = 'ChallengeService';

class ChallengeService{

    public async getAllChallenges(userId: string): Promise<any> {
        logger.info('Getting all challenges', { className });
        try {
            const challenges = await ChallengeModel.getAllChallenges();
            logger.info('Challenges retrieved successfully', { className });

            logger.info('Checking obtained status for the user', { className });

            const challengesWithObtained = await Promise.all(challenges.map(async (challenge: any) => {
                const points = await PointsModel.findPointsByUserIdAndChallengeId(userId, challenge.id);
                return {
                    ...challenge,
                    obtained: !!points
                };
            }));

            logger.info('Challenges retrieved successfully', { className });
            return challengesWithObtained;
        } catch (error) {
            logger.error('Error getting challenges: ' + error, { error, className });
            throw error;
        }
    }

}

export default new ChallengeService();
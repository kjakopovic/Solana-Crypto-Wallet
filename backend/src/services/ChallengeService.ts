// src/service/ChallengeService.ts

import logger from '../config/Logger';
import ChallengeModel from '../models/ChallengeModel';

const className = 'ChallengeService';

class ChallengeService{

    public async getAllChallenges(): Promise<any> {
        logger.info('Getting all challenges', { className });
        try {
            const challenges = await ChallengeModel.getAllChallenges();
            logger.info('Challenges retrieved successfully', { className });
            return challenges;
        } catch (error) {
            logger.error('Error getting challenges: ' + error, { error, className });
            throw error;
        }
    }

}

export default new ChallengeService();
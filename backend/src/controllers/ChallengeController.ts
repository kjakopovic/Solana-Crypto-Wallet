// src/controllers/ChallengeController.ts

import { Request, Response } from 'express';
import logger from '../config/Logger';
import ChallengeService from '../services/ChallengeService';

const className = 'ChallengeController';

class ChallengeController {

    async getAllChallenges(req: Request, res: Response): Promise<Response> {
        logger.info('Getting all challenges', { className });

        try {
            const challenges = await ChallengeService.getAllChallenges();
            return res.status(200).json(challenges);
        } catch (error) {
            logger.error('Error getting challenges: ' + error, { error, className });
            return res.status(500).json({ message: 'Error getting challenges' });
        }
    }
}

export default new ChallengeController();
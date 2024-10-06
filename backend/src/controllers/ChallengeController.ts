// src/controllers/ChallengeController.ts

import { Request, Response } from 'express';
import logger from '../config/Logger';
import ChallengeService from '../services/ChallengeService';
import UserService from "../services/UserService";

const className = 'ChallengeController';

class ChallengeController {

    async getAllChallenges(req: Request, res: Response): Promise<Response> {
        logger.info('Getting all challenges', { className });

        const publicKey = req.body.publicKey;

        if(!publicKey){
            logger.error('Public key is required', { className });
            return res.status(400).json({ message: 'Public key is required' });
        }

        try {
            logger.info('Getting all challenges', { className });
            const user = await UserService.findUserByField('publicKey', publicKey);

            if(!user){
                logger.error('User not found', { className });
                return res.status(404).json({ message: 'User not found' });
            }

            const challenges = await ChallengeService.getAllChallenges(user.id);
            return res.status(200).json(challenges);
        } catch (error) {
            logger.error('Error getting challenges: ' + error, { error, className });
            return res.status(500).json({ message: 'Error getting challenges' });
        }
    }
}

export default new ChallengeController();
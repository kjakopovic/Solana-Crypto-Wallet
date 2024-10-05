// src/controllers/NFTController.ts

import { Request, Response } from 'express';
import logger from '../config/Logger';
import NFTService from '../services/NFTService';

const className = 'NFTController';

class NFTController {

    async getWelcomeNFT(req: Request, res: Response): Promise<Response> {
        logger.info('Getting welcome NFT', { className });
        try {
            const nft = await NFTService.getWelcomeNFT();
            return res.status(200).json(nft);
        } catch (err) {
            logger.error('Error getting welcome NFT: ' + err, { error: err, className });
            return res.status(500).json({ message: 'Error getting welcome NFT: ' + err });
        }
    }

}

export default new NFTController();
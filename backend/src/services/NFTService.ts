// src/services/NFTService.ts

import logger from '../config/Logger';
import fs from 'fs';
import path from 'path';
import NFTModel from '../models/NFTModel';


const className = 'NFTService';

class NFTService {

    public async getWelcomeNFT(): Promise<Buffer | null> {
        logger.info('Getting the welcome NFT', { className });

        try{
            const nftRecord = await NFTModel.getWelcomeNFT();
            if(nftRecord == null){
                logger.error('No welcome NFT found', { className });
                const defaultNFTPath = path.join(__dirname, '../data/images/welcome-nft.jpg');
                const imageBuffer = fs.readFileSync(defaultNFTPath);

                await NFTModel.saveNFTBuffer(imageBuffer, 'Welcome NFT');

                const retryNFT = await NFTModel.getWelcomeNFT();
                if(retryNFT == null){
                    logger.error('No welcome NFT found after retry', { className });
                    return null;
                }

                return retryNFT.imageBuffer;
            }

            return nftRecord.imageBuffer;
        }catch(err){
            logger.error('Error getting welcome NFT', { error: err, className });
            throw err;
        }
    }
}

export default new NFTService();
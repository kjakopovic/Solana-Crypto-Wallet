// src/controllers/WalletController.ts

import { Request, Response } from 'express';
import { createWallet, getBalance, transferSol } from '../models/WalletModel';
import { Keypair } from '@solana/web3.js';
import logger from '../config/Logger';

const className = 'WalletController';

// Create a new wallet
export const createWalletController = (req: Request, res: Response): Response => {
    logger.info('Creating a new wallet', { className });

    try{
        const wallet = createWallet();
        logger.info('Wallet created', { className });
        return res.status(200).json(wallet);
    } catch(error){
        logger.error({ message: 'Error creating wallet', error, className });
        return res.status(500).json({ message: 'Error creating wallet' });
    }
}

// Get wallet balance
export const getBalanceController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Getting wallet balance', { className });
    const { publicKey } = req.params;

    try{
        const balance = await getBalance(publicKey);
        logger.info('Balance fetched', { className });
        return res.status(200).json({ balance });
    }catch(error){
        logger.error({ message: 'Error fetching balance', error, className });
        return res.status(500).json({ message: 'Error fetching balance' });
    }
}

// Transfer SOL from one wallet to another
export const transferSolController = async (req: Request, res: Response): Promise<Response> => {
    logger.info('Transferring SOL from one wallet to another', { className });
    const { fromSecretKey, toPublicKey, amount } = req.body;

    try{
        const fromKeypair = Keypair.fromSecretKey(Buffer.from(fromSecretKey, 'hex'));
        const signature = await transferSol(fromKeypair, toPublicKey, amount);
        logger.info('Transaction successful', { className });
        return res.status(200).json({ signature });
    }catch(error){
        logger.error({ message: 'Error transferring SOL', error, className });
        return res.status(500).json({ message: 'Error transferring SOL' });
    }
}

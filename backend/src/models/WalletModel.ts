// src/models/WalletModel.ts

import {Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction} from '@solana/web3.js';
import connection from '../config/SolanaConfig';
import logger from '../config/Logger';

const className = 'WalletModel';

// TODO: Remove secretKey from the response later
// Create a new wallet (KeyPair)
export const createWallet = () => {
    logger.info('Creating a new wallet', { className });
    const keypair = Keypair.generate();
    const wallet = {
        publicKey: keypair.publicKey.toString(),
        secretKey: Buffer.from(keypair.secretKey).toString('hex'),
    };

    logger.info('Wallet created', { className });
    return wallet;
}

// Get balance of a wallet
export const getBalance = async (publicKey: string): Promise<number> => {
    logger.info('Getting balance of a wallet', { className });
    try{
        const balance = await connection.getBalance(new PublicKey(publicKey));
        logger.info({ message: 'Balance fetched: ' + (balance / LAMPORTS_PER_SOL) + ' SOL', className });
        return balance / LAMPORTS_PER_SOL;
    }catch(error){
        logger.error({ message: 'Error fetching balance', error, className });
        throw new Error('Error fetching balance');
    }
}

// Transfer SOL from one wallet to another
export const transferSol = async(
    fromKeypair: Keypair,
    toPublicKey: string,
    amount: number
): Promise<string> => {
    logger.info('Transferring SOL from one wallet to another', { className });
    try{
        const toPublicKeyInstance = new PublicKey(toPublicKey);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKeyInstance,
                lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
        logger.info('Transaction successful', { className });
        return signature;
    }catch(error){
        logger.error({ message: 'Error transferring SOL', error, className });
        throw new Error('Error transferring SOL');
    }

}


import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import {
    TokenSwap,
    TOKEN_SWAP_PROGRAM_ID,
    TokenSwapLayout,
    CurveType,
} from '@solana/spl-token-swap';

import { getItem } from '@/context/SecureStorage';
import { getWalletConnection } from '@/context/WalletFunctions';

const SOL_MINT = 'So11111111111111111111111111111111111111112'

const getTokenAccountCreationInstruction = async (
    mintAddress: string, 
    swapAuthority: web3.PublicKey, 
    payer: web3.PublicKey
): Promise<[web3.PublicKey, web3.TransactionInstruction]> => {
    let tokenAccountAddress = await token.getAssociatedTokenAddress(
        new web3.PublicKey(mintAddress),
        swapAuthority,
        true,
    );

    const tokenAccountInstruction = token.createAssociatedTokenAccountInstruction(
        payer,
        tokenAccountAddress,
        swapAuthority,
        new web3.PublicKey(mintAddress),
    );

    return [tokenAccountAddress, tokenAccountInstruction];
};

export const createSwapPool = async (convertFromMint: string, convertToMint: string, amountToSwap: number) => {
    const connection = getWalletConnection();

    try {
        // Setting up token swap state account
        const transaction = new web3.Transaction();
        const tokenSwapStateAccount = web3.Keypair.generate();

        const wallet = web3.Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));

        const rent = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);

        const tokenSwapStateAccountInstruction = web3.SystemProgram.createAccount({
            newAccountPubkey: tokenSwapStateAccount.publicKey,
            fromPubkey: wallet.publicKey,
            lamports: rent,
            space: TokenSwapLayout.span,
            programId: TOKEN_SWAP_PROGRAM_ID,
        });

        transaction.add(tokenSwapStateAccountInstruction);

        // Creating swap authority
        const [ swapAuthority, bump ] = web3.PublicKey.findProgramAddressSync(
            [tokenSwapStateAccount.publicKey.toBuffer()],
            TOKEN_SWAP_PROGRAM_ID,
        );

        // Getting tokens account info for swapping
        const [convertFromTokenAccountAddress, convertFromTokenAccountInstruction] = await getTokenAccountCreationInstruction(
            convertFromMint,
            swapAuthority,
            wallet.publicKey,
        );

        const [convertToTokenAccountAddress, convertToTokenAccountInstruction] = await getTokenAccountCreationInstruction(
            convertToMint,
            swapAuthority,
            wallet.publicKey,
        );

        transaction.add(convertFromTokenAccountInstruction, convertToTokenAccountInstruction);

        // Creating mint token for the pool
        const poolTokenMint = await token.createMint(
            connection,
            wallet,
            swapAuthority,
            null,
            2,
        );

        // Creating pool token account
        const tokenAccountPool = web3.Keypair.generate();
        
        const poolRent = await token.getMinimumBalanceForRentExemptAccount(connection);

        const createTokenAccountPoolInstruction = web3.SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: tokenAccountPool.publicKey,
            space: token.ACCOUNT_SIZE,
            lamports: poolRent,
            programId: token.TOKEN_PROGRAM_ID,
        });

        const initializeTokenAccountPoolInstruction = token.createInitializeAccountInstruction(
            tokenAccountPool.publicKey,
            poolTokenMint,
            wallet.publicKey,
        );

        transaction.add(createTokenAccountPoolInstruction);
        transaction.add(initializeTokenAccountPoolInstruction);

        // Creating pool token fee account
        const feeOwner = new web3.PublicKey('HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN');

        let tokenFeeAccountAddress = await token.getAssociatedTokenAddress(
            poolTokenMint,
            feeOwner,
            true,
        );

        const tokenFeeAccountInstruction = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenFeeAccountAddress,
            feeOwner,
            poolTokenMint,
        );

        transaction.add(tokenFeeAccountInstruction);

        // Creating pool
        const initSwapInstruction = TokenSwap.createInitSwapInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            convertFromTokenAccountAddress,
            convertToTokenAccountAddress,
            poolTokenMint,
            tokenFeeAccountAddress,
            tokenAccountPool.publicKey,
            token.TOKEN_PROGRAM_ID,
            TOKEN_SWAP_PROGRAM_ID,
            0n,
            0n,
            0n,
            0n,
            0n,
            0n,
            0n,
            0n,
            CurveType.ConstantProduct,
        );

        transaction.add(initSwapInstruction);

        const signature = await connection.sendTransaction(transaction, [wallet, tokenSwapStateAccount, tokenAccountPool]);

        console.log(signature);
    } catch (error: any) {
        console.log(error);

        if (error instanceof web3.SendTransactionError) {
            error.getLogs(connection);
        }

        throw error;
    }
}
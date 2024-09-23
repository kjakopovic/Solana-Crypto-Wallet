import '../context/polyfills';
import 'react-native-get-random-values';

import * as bip39 from 'bip39';
import { 
  Keypair,
  Connection, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  TransactionConfirmationStrategy,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Cluster
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getMint
} from "@solana/spl-token";
// import { TokenListProvider, TokenInfo as RegistryTokenInfo } from '@solana/spl-token-registry';

import { saveItem, getItem } from './SecureStorage';

import tokens from '../assets/solana.tokenlist.json';

bip39.setDefaultWordlist('english');

const fetch = require('node-fetch');

const SOL_MINT = 'So11111111111111111111111111111111111111112'

interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
}

interface TokensData {
  tokens: TokenInfo[];
}

interface TokenInfoPreview {
  name: string;
  symbol: string;
  address: string;
  oneDayMovement: string;
  marketValueInDollars: string;
  userAmount: string;
  logoURIbase64: string;
}

interface WalletInfo {
  balance: string;
  tokens: TokenInfoPreview[];
}

interface CoinGeckoCoinsList {
  id: string;
  symbol: string;
  name: string;
}

interface CoinMarketInfo {
  current_price: number;
  price_change_percentage_24h: number;
  symbol: string;
}

interface TransactionHistoryData {
  transferBalanceInToken: number;
  transferTimestamp: string;
  coinLogoBase64: string;
  coinName: string;
  fromPublicWallet: string;
  toPublicWallet: string;
}

const tokensData = tokens as TokensData;

const generateWalletFromMnemonic = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic, "");

  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Buffer.from(keypair.secretKey).toString('hex');

  saveItem('publicKey', publicKey);
  saveItem('privateKey', privateKey);
};

const getWalletConnection = () => {
  const connection = new Connection(
    clusterApiUrl(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER as Cluster),
    'confirmed'
  );

  return connection;
}

export const generateWallet = () => {
  try {
    const mnemonic = bip39.generateMnemonic();

    generateWalletFromMnemonic(mnemonic);

    return mnemonic;
  } catch (error) {
    console.error('Error generating wallet:', error);
    throw error;
  }
};

export const restoreWallet = (mnemonic: string) => {
  try {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic');
    }

    generateWalletFromMnemonic(mnemonic);
    console.log(`TODO temp: ${getItem('publicKey')}`);
  } catch (error) {
    console.error('Error restoring wallet:', error);
    throw error;
  }
};

export const getWalletInfo = async (): Promise<WalletInfo> => {
  //TODO: refactor, imam coingecko id za svaki coin ne treba mi dohvacanje IDjeva sa coin gecka
  try {
    // Getting metadata about the wallet
    const connection = getWalletConnection();
    const publicKey = new PublicKey(getItem('publicKey') ?? '');

    // Getting users coins that are not solana
    const tokens = await connection.getTokenAccountsByOwner(publicKey, {
      // programId: new PublicKey(TOKEN_PROGRAM_ID),
      programId: TOKEN_PROGRAM_ID,
    });

    // Preparing variables for calculations
    const tokenInfoPreviews: TokenInfoPreview[] = [];
    let listOfSymbols: string[] = [ 'SOL'];

    // Getting users solana balance
    const solBalance = (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
    const additionalSolInfo = tokensData.tokens.find(tokenInfo => tokenInfo.symbol === 'SOL');

    const solInfo: TokenInfoPreview = {
      name: 'Solana',
      symbol: 'SOL',
      address: additionalSolInfo?.address ?? '',
      oneDayMovement: '',
      marketValueInDollars: '',
      userAmount: solBalance.toString(),
      logoURIbase64: additionalSolInfo?.logoURI ?? '',
    };

    tokenInfoPreviews.push(solInfo);

    // Getting data about other coins
    for (const token of tokens.value) {
      const additionalInfo = tokensData.tokens.find(tokenInfo => tokenInfo.address === token.pubkey.toBase58());
      
      if (additionalInfo !== undefined) {
        listOfSymbols.push(additionalInfo.symbol);
      }

      const mintInfo = await getMint(connection, new PublicKey(additionalInfo?.address ?? ''));

      const info: TokenInfoPreview = {
        name: additionalInfo?.name ?? '',
        symbol: additionalInfo?.symbol ?? '',
        address: additionalInfo?.address ?? '',
        oneDayMovement: '',
        marketValueInDollars: '',
        userAmount: (token.account.lamports / mintInfo.decimals).toFixed(2),
        logoURIbase64: additionalInfo?.logoURI ?? '',
      };

      tokenInfoPreviews.push(info);
    }

    // Data for apis from coingecko
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-api-key': process.env.EXPO_PUBLIC_COIN_GECKO_API_KEY}
    };

    // List of all coin gecko supported coins
    const coinGeckoCoinsResponse = await fetch(url, options);

    const coinGeckoCoins: CoinGeckoCoinsList[] = await coinGeckoCoinsResponse.json();

    // List of coingecko ids for our wallet coins
    let listOfIds: string[] = [];

    // Getting ids for our coins
    for (const symbol of listOfSymbols) {
      const currentGeckoCoin = coinGeckoCoins.find(coin => coin.symbol === symbol);
      
      if (currentGeckoCoin !== undefined) {
        listOfIds.push(currentGeckoCoin.id);
      }
    }

    // Fetching data about coins from wallet from coingecko
    const coinMarketData: CoinMarketInfo[] = await (await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + listOfIds.join(','),
      options
    )).json();

    // Setting balance variable for total wallet balance
    let balance: number = 0;

    // Calculating total wallet balance and coins live data
    for (const token of tokenInfoPreviews) {
      const currentCoin = coinMarketData.find(x => x.symbol === token.symbol.toLowerCase());

      token.oneDayMovement = currentCoin?.price_change_percentage_24h.toFixed(2).toString() + '%' ?? '0.00%';
      token.marketValueInDollars = currentCoin?.current_price.toString() ?? '0.00';

      balance += (parseFloat(token.userAmount) * parseFloat(token.marketValueInDollars));
    }

    const walletInfo: WalletInfo = {
      balance: balance.toString(),
      tokens: tokenInfoPreviews,
    };

    return walletInfo;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
}

export const airdropMoney = async (amount: number) => {
  try {
    const connection = getWalletConnection();
  
    const publicKey = getItem('publicKey') ?? '';
  
    const airdropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      amount * LAMPORTS_PER_SOL
    );
  
    await connection.confirmTransaction({ signature: airdropSignature } as TransactionConfirmationStrategy);
  } catch (error) {
    throw error;
  }
}

export const calculateTransactionFees = async (toPublicKey: string, amount: number, tokenMint: string) => {
  try {
    const connection = getWalletConnection();

    const recentBlockhash = await connection.getLatestBlockhash();

    const fromWallet = Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));

    const mintInfo = await getMint(connection, new PublicKey(tokenMint));
    
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      new PublicKey(tokenMint),
      fromWallet.publicKey
    );
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      new PublicKey(tokenMint),
      new PublicKey(toPublicKey)
    );

    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: fromWallet.publicKey,
    }).add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        amount * mintInfo.decimals,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    return {
      fee: await transaction.getEstimatedFee(connection) ?? 0,
      transaction: transaction
    }
  } catch (error) {
    console.log('Error calculating transaction fees:', error);
  }
}

export const sendTokensTransaction = async (transaction: Transaction | null) => {
  if (!transaction){
    return;
  }
  
  const connection = getWalletConnection();

  const fromWallet = Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));

  await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
};

export const getTransactionsHistory = async (currentPage: number): Promise<TransactionHistoryData[]> => {
  try {
    const connection = getWalletConnection();
    const publicKey = new PublicKey(getItem('publicKey') ?? '');

    const pageLimit = 10;

    // If it's not the first page, calculate the 'before' parameter
    let beforeSignature = undefined;
    if (currentPage > 1) {
      const previousPageHistory = await connection.getSignaturesForAddress(
        publicKey,
        { limit: pageLimit * (currentPage - 1) }
      );

      // Get the last transaction signature of the previous page
      if (previousPageHistory.length > 0) {
        beforeSignature = previousPageHistory[previousPageHistory.length - 1].signature;
      }
    }

    const history = await connection.getSignaturesForAddress(
      publicKey,
      {
        limit: pageLimit,
        before: beforeSignature,
      }
    );

    const detailedHistory = await Promise.all(
      history.map(async (tx) => {
        const transactionDetails = await connection.getParsedTransaction(tx.signature);

        const tokenPreTransferAmount = transactionDetails?.meta?.preTokenBalances![1]
        const tokenPostTransferAmount = transactionDetails?.meta?.postTokenBalances![1]
        
        // Checking is transaction for a token transfer
        if (tokenPreTransferAmount?.uiTokenAmount !== undefined && 
            tokenPostTransferAmount?.uiTokenAmount !== undefined &&
            tokenPreTransferAmount.uiTokenAmount.uiAmount !== tokenPostTransferAmount.uiTokenAmount.uiAmount
        ){
          return {
            transferBalanceInToken: (tokenPostTransferAmount.uiTokenAmount.uiAmount ?? 0) - (tokenPreTransferAmount.uiTokenAmount.uiAmount ?? 0),
            coinMint: transactionDetails?.meta?.preTokenBalances![1].mint ?? '',
            transferTimestamp: new Date((tx.blockTime ?? 0) * 1000).toLocaleString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) ?? 'Unknown',
            fromPublicWallet: transactionDetails?.transaction.message.accountKeys[0].pubkey.toBase58() ?? '',
            toPublicWallet: transactionDetails?.transaction.message.accountKeys[1].pubkey.toBase58() ?? '',
          }
        }

        return {
          transferBalanceInToken: ((transactionDetails?.meta?.postBalances[1] ?? 0) - (transactionDetails?.meta?.preBalances[1] ?? 0)) / LAMPORTS_PER_SOL,
          coinMint: SOL_MINT,
          transferTimestamp: new Date((tx.blockTime ?? 0) * 1000).toLocaleString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) ?? 'Unknown',
          fromPublicWallet: transactionDetails?.transaction.message.accountKeys[0].pubkey.toBase58() ?? '',
          toPublicWallet: transactionDetails?.transaction.message.accountKeys[1].pubkey.toBase58() ?? '',
        };
      })
    );

    let historyResponse: TransactionHistoryData[] = [];

    for (const transaction of detailedHistory) {
      const additionalInfo = tokensData.tokens.find(token => token.address === transaction.coinMint);

      historyResponse.push({
        transferBalanceInToken: transaction.transferBalanceInToken,
        coinLogoBase64: additionalInfo?.logoURI ?? '',
        coinName: additionalInfo?.name ?? 'Solana',
        fromPublicWallet: transaction.fromPublicWallet,
        toPublicWallet: transaction.toPublicWallet,
        transferTimestamp: transaction.transferTimestamp,
      })
    }

    return historyResponse;
  } catch (error) {
    throw error;
  }
}

export const getAllAvailableTokens = () => {
  const solIndex = tokensData.tokens.findIndex(token => token.symbol === 'SOL');

  // If 'SOL' is found and is not already at the first position
  if (solIndex !== -1 && solIndex !== 0) {
    // Remove the token from its current position
    const [solToken] = tokensData.tokens.splice(solIndex, 1);

    // Insert the token at the first position
    tokensData.tokens.unshift(solToken);
  }

  return tokensData.tokens;

  // new TokenListProvider().resolve().then((tokens) => {
  //   const tokenList = tokens.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();
  //   console.log(tokenList);
  // });
}

export const getSelectedCoinAmount = async (coinMint: string) => {
  try{
    // Getting metadata about the wallet
    const connection = getWalletConnection();
    const publicKey = new PublicKey(getItem('publicKey') ?? '');

    if (coinMint === SOL_MINT) {
      return ((await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL).toFixed(2).toString();
    }

    // Getting users coins that are not solana
    const tokens = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const currentCoin = tokens.value.find(token => token.pubkey.toBase58() === coinMint);
    const mintInfo = await getMint(connection, new PublicKey(coinMint));

    return (currentCoin?.account.lamports ?? 0 / mintInfo.decimals).toFixed(2);
  }
  catch (error) {
    throw error;
  }
}

export {
  TokenInfoPreview,
  WalletInfo,
  TransactionHistoryData,
  TokenInfo
}
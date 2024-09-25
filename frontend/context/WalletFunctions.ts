import '../context/polyfills';
// import 'react-native-get-random-values';
import { createJupiterApiClient, ResponseError } from '@jup-ag/api';

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
  Cluster,
  VersionedTransaction
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getMint,
  AccountLayout
} from "@solana/spl-token";
import { TokenListProvider, TokenInfo, TokenListContainer } from '@solana/spl-token-registry';
import { TokenSwap, CurveType, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";

import { saveItem, getItem } from './SecureStorage';

bip39.setDefaultWordlist('english');

const SOL_MINT = 'So11111111111111111111111111111111111111112'

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

const generateWalletFromMnemonic = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic, "");

  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Buffer.from(keypair.secretKey).toString('hex');

  saveItem('publicKey', publicKey);
  saveItem('privateKey', privateKey);
};

export const getWalletConnection = () => {
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
      programId: TOKEN_PROGRAM_ID,
    });

    // Preparing variables for calculations
    const tokenInfoPreviews: TokenInfoPreview[] = [];
    let listOfSymbols: string[] = [ 'SOL'];

    // Getting list of supported tokens
    const tokenListProvider = await new TokenListProvider().resolve();
    const tokenList = tokenListProvider.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();

    // Getting users solana balance
    const solBalance = (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
    // const additionalSolInfo = tokensData.tokens.find(tokenInfo => tokenInfo.symbol === 'SOL');
    const additionalSolInfo = tokenList.find(token => token.address === SOL_MINT);

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

    tokens.value.map(({ pubkey, account }) => {
      // Decode the token account data
      const accountInfo = AccountLayout.decode(account.data);
  
      // Extract the mint address and balance
      const mintAddress = new PublicKey(accountInfo.mint).toBase58();
  
      // Find token metadata (name, symbol, logo) using the mint address
      const tokenInfo = tokenList.find((token) => token.address === mintAddress);
  
      const info: TokenInfoPreview = {
        name: tokenInfo?.name ?? '',
        symbol: tokenInfo?.symbol ?? '',
        address: mintAddress,
        oneDayMovement: '',
        marketValueInDollars: '',
        userAmount: (accountInfo.amount).toString(),
        logoURIbase64: tokenInfo?.logoURI ?? '',
      };

      tokenInfoPreviews.push(info);
    });

    // Data for apis from coingecko
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-api-key': process.env.EXPO_PUBLIC_COIN_GECKO_API_KEY || ''}
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

      if (currentCoin === undefined) {
        token.oneDayMovement = '0.00%';
        token.marketValueInDollars = '0.00';
      }

      token.oneDayMovement = currentCoin?.price_change_percentage_24h?.toFixed(2) + '%' ?? '0.00%';
      token.marketValueInDollars = currentCoin?.current_price?.toString() ?? '0.00';

      balance += (parseFloat(token.userAmount) * parseFloat(token.marketValueInDollars));
    }

    const walletInfo: WalletInfo = {
      balance: balance.toFixed(2),
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

    // Getting lamports per coin
    const mintInfo = await getMint(connection, new PublicKey(tokenMint));
    const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);
    
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
        amount * LAMPORTS_PER_COIN,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    return {
      fee: (await transaction.getEstimatedFee(connection) ?? 0) / LAMPORTS_PER_COIN,
      transaction: transaction
    }
  } catch (error) {
    console.log('Error calculating transaction fees:', error);
  }
}

export const sendTokensTransaction = async (transaction: Transaction | null) => {
  if (!transaction){
    throw new Error('Transaction is not defined');
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
    const offset = (currentPage - 1) * pageLimit;

    // Pre-fetch token list once
    const tokenListProvider = await new TokenListProvider().resolve();
    const tokenList = tokenListProvider
      .filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '')
      .getList();

    // Fetch signatures for the current page
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: pageLimit, before: undefined });

    const history = signatures.slice(offset, offset + pageLimit);

    // Fetch detailed transaction history in parallel
    const detailedHistory = await Promise.all(
      history.map(async (tx) => {
        const transactionDetails = await connection.getParsedTransaction(tx.signature);

        // Extract token transfer details if available
        const tokenPreTransferAmount = transactionDetails?.meta?.preTokenBalances?.[1];
        const tokenPostTransferAmount = transactionDetails?.meta?.postTokenBalances?.[1];

        // Check if transaction is token transfer or SOL transfer
        if (
          tokenPreTransferAmount?.uiTokenAmount !== undefined &&
          tokenPostTransferAmount?.uiTokenAmount !== undefined &&
          tokenPreTransferAmount.uiTokenAmount.uiAmount !== tokenPostTransferAmount.uiTokenAmount.uiAmount
        ) {
          const mintInfo = await getMint(connection, new PublicKey(tokenPreTransferAmount.mint));
          const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);

          return {
            transferBalanceInToken:
              ((tokenPostTransferAmount.uiTokenAmount.uiAmount ?? 0) - (tokenPreTransferAmount.uiTokenAmount.uiAmount ?? 0))
              / LAMPORTS_PER_COIN, //TODO: kada bude tih transfera treba pogledati jel ovo tocno
            coinMint: tokenPreTransferAmount.mint ?? '',
            transferTimestamp: new Date((tx.blockTime ?? 0) * 1000).toLocaleString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            fromPublicWallet: transactionDetails?.transaction.message.accountKeys[0].pubkey.toBase58() ?? '',
            toPublicWallet: transactionDetails?.transaction.message.accountKeys[1].pubkey.toBase58() ?? '',
          };
        }

        const accountKeys = transactionDetails?.transaction.message.accountKeys;

        if (accountKeys === undefined) {
          return;
        }

        const userAccountIndex = accountKeys.findIndex(account => account.pubkey.toBase58() === getItem('publicKey'));

        if (userAccountIndex === -1) {
          return;
        }

        return {
          transferBalanceInToken:
            ((transactionDetails?.meta?.postBalances[userAccountIndex] ?? 0) - (transactionDetails?.meta?.preBalances[userAccountIndex] ?? 0)) /
            LAMPORTS_PER_SOL,
          coinMint: SOL_MINT,
          transferTimestamp: new Date((tx.blockTime ?? 0) * 1000).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          fromPublicWallet: accountKeys[0].pubkey.toBase58() ?? '',
          toPublicWallet: accountKeys[1].pubkey.toBase58() ?? '',
        };
      })
    );

    // Build the final history response
    const historyResponse: TransactionHistoryData[] = detailedHistory.map((transaction) => {
      const additionalInfo = tokenList.find((token) => token.address === transaction?.coinMint);

      return {
        transferBalanceInToken: transaction?.transferBalanceInToken ?? 0,
        coinLogoBase64: additionalInfo?.logoURI ?? '',
        coinName: (additionalInfo?.symbol === 'wSOL' ? 'Solana' : additionalInfo?.name) ?? '',
        fromPublicWallet: transaction?.fromPublicWallet ?? '',
        toPublicWallet: transaction?.toPublicWallet ?? '',
        transferTimestamp: transaction?.transferTimestamp ?? '',
      };
    });

    return historyResponse;
  } catch (error) {
    throw error;
  }
};

export const getAllAvailableTokens = async (): Promise<TokenInfo[]> => {
  const tokenListProvider = await new TokenListProvider().resolve()

  let tokenList =  tokenListProvider.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();

  tokenList = tokenList.filter(token => token.symbol !== 'wSOL');

  tokenList.unshift({
    chainId: 101,
    address: SOL_MINT,
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  });

  return tokenList;
}

export const getSelectedCoinAmount = async (coinMint: string) => {
  try{
    // Getting metadata about the wallet
    const connection = getWalletConnection();
    const publicKey = new PublicKey(getItem('publicKey') ?? '');

    if (coinMint === SOL_MINT) {
      return ((await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL).toString();
    }

    // Getting users coins that are not solana
    const tokens = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const currentCoin = tokens.value.find(token => token.pubkey.toBase58() === coinMint);
    const mintInfo = await getMint(connection, new PublicKey(coinMint));
    const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);

    return (currentCoin?.account.lamports ?? 0 / LAMPORTS_PER_COIN).toString();
  }
  catch (error) {
    throw error;
  }
}

//Jupiter API, radi samo na mainnetu
// export const swapTokens = async (fromTokenMint: string, toTokenMint: string, swapAmount: number) => {
//   try {
//     const connection = getWalletConnection();
//     const jupiterQuoteApi = createJupiterApiClient();
  
//     const mintInfo = await getMint(connection, new PublicKey(fromTokenMint));
//     const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);

//     const amountInLamports = swapAmount * LAMPORTS_PER_COIN;
    
//     const quote = await jupiterQuoteApi.quoteGet({
//       inputMint: fromTokenMint,
//       outputMint: toTokenMint,
//       amount: amountInLamports,
//     });

//     console.log(quote);

//     const serializedQuote = await jupiterQuoteApi.swapPost({
//       swapRequest: {
//         userPublicKey: getItem('publicKey') ?? '',
//         wrapAndUnwrapSol: true,
//         quoteResponse: quote
//       }
//     });

//     const swapTransactionBuf = Buffer.from(serializedQuote.swapTransaction, 'base64');
//     var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

//     const latestBlockHash = await connection.getLatestBlockhash();
//     const rawTransaction = transaction.serialize();

//     const txid = await connection.sendRawTransaction(rawTransaction, {
//       skipPreflight: true,
//       maxRetries: 2
//     });

//     await connection.confirmTransaction({
//       blockhash: latestBlockHash.blockhash,
//       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//       signature: txid
//     });
//   } catch (error: any) {
//     console.log(error.response);
//     throw error;
//   }
// }

export const swapTokens = async (fromTokenMint: string, toTokenMint: string, swapAmount: number) => {
  try {
    const SWAP_POOL_ADDRESS = new PublicKey(process.env.EXPO_PUBLIC_SWAP_POOL_ADDRESS ?? '');

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // Retrieve the payer (user wallet)
    const payer = Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));
    const userPublicKey = payer.publicKey;

    // Load the TokenSwap instance for the specific pool
    const tokenSwap = await TokenSwap.loadTokenSwap(
      connection,
      SWAP_POOL_ADDRESS,
      TOKEN_SWAP_PROGRAM_ID,
      payer
    );

    // Fetch the mint info to calculate lamports per coin
    const mintInfo = await getMint(connection, new PublicKey(fromTokenMint));
    const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);

    // Convert the swap amount to lamports
    const amountInLamports = BigInt(swapAmount * LAMPORTS_PER_COIN);

    // Create or get the associated token accounts for the user
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      new PublicKey(fromTokenMint),
      userPublicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      new PublicKey(toTokenMint),
      userPublicKey
    );

    // Pool accounts
    const poolSourceTokenAccount = tokenSwap.tokenAccountA; // Pool's token A account
    const poolDestinationTokenAccount = tokenSwap.tokenAccountB; // Pool's token B account

    // Create user transfer authority (this can be a temporary keypair)
    const userTransferAuthority = Keypair.generate();

    // Approve transfer of tokens from the user's account to the pool
    const minimumAmountOut = BigInt(1); // Set to a minimum acceptable output, adjust for slippage

    // Swap Transaction
    const swapTransaction = new Transaction().add(
      TokenSwap.swapInstruction(
        tokenSwap.swapProgramId, // Swap pool address
        tokenSwap.authority, // Pool authority
        userTransferAuthority.publicKey, // User's transfer authority
        fromTokenAccount.address, // User's source token account
        poolSourceTokenAccount, // Pool's source token account
        poolDestinationTokenAccount, // Pool's destination token account
        toTokenAccount.address, // User's destination token account
        tokenSwap.poolToken, // Pool token mint account
        tokenSwap.feeAccount, // Pool's fee account
        null, // Host fee account (optional, use null if no host fee)
        new PublicKey(fromTokenMint), // Source mint
        new PublicKey(toTokenMint), // Destination mint
        TOKEN_SWAP_PROGRAM_ID, // Swap program ID
        TOKEN_PROGRAM_ID, // Token program ID
        TOKEN_PROGRAM_ID, // Token program ID (destinationTokenProgramId is often the same)
        tokenSwap.poolTokenProgramId, // Pool token program ID
        amountInLamports, // Amount of source token to swap (in lamports)
        minimumAmountOut // Minimum amount of destination token (adjust slippage tolerance)
      )
    );

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      swapTransaction,
      [payer, userTransferAuthority], // Signers: payer and user transfer authority
      {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      }
    );

    console.log("Transaction confirmed with signature: ", signature);
  } catch (error) {
    console.error("Error during token swap:", error);
    throw error;
  }
}

export {
  TokenInfoPreview,
  WalletInfo,
  TransactionHistoryData,
  TokenInfo
}
import '../context/polyfills';
import { createJupiterApiClient, QuoteResponse } from '@jup-ag/api';

import * as bip39 from 'bip39';
import { 
  Keypair,
  Connection, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL, 
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Cluster,
  VersionedTransaction,
  StakeProgram,
  Authorized,
  Lockup
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getMint,
  AccountLayout
} from "@solana/spl-token";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { saveItem, getItem } from './SecureStorage';

bip39.setDefaultWordlist('english');

const SOL_MINT = 'So11111111111111111111111111111111111111112'

interface TokenInfoPreview {
  name: string;
  symbol: string;
  address: string;
  marketValueInDollars: string;
  userAmount: string;
  logoURIbase64: string;
}

interface WalletInfo {
  balance: string;
  tokens: TokenInfoPreview[];
}

interface TransactionHistoryData {
  transferBalanceInToken: number;
  transferTimestamp: string;
  coinLogoBase64: string;
  coinName: string;
  fromPublicWallet: string;
  toPublicWallet: string;
}

interface StakingItemData {
  stakePubkey: string;
  stakeBalance: number;
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
  } catch (error) {
    console.error('Error restoring wallet:', error);
    throw error;
  }
};

export const getWalletInfo = async (): Promise<WalletInfo> => {
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
    let listOfMints: string[] = [ SOL_MINT ];

    // Getting list of supported tokens
    const tokenListProvider = await new TokenListProvider().resolve();
    const tokenList = tokenListProvider.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();

    // Getting users solana balance
    const solBalance = (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;

    const additionalSolInfo = tokenList.find(token => token.address === SOL_MINT);

    const solInfo: TokenInfoPreview = {
      name: 'Wrapped SOL',
      symbol: 'SOL',
      address: additionalSolInfo?.address ?? '',
      marketValueInDollars: '',
      userAmount: solBalance.toString(),
      logoURIbase64: additionalSolInfo?.logoURI ?? '',
    };

    tokenInfoPreviews.push(solInfo);

    tokens.value.map(({ pubkey, account }) => {
      // Decode the token account data
      const accountInfo = AccountLayout.decode(account.data);

      const userAmount = (accountInfo.amount).toString();

      if (userAmount !== '0') {
        // Extract the mint address and balance
        const mintAddress = new PublicKey(accountInfo.mint).toBase58();
    
        // Find token metadata (name, symbol, logo) using the mint address
        const tokenInfo = tokenList.find((token) => token.address === mintAddress);
    
        const info: TokenInfoPreview = {
          name: tokenInfo?.name ?? '',
          symbol: tokenInfo?.symbol ?? '',
          address: mintAddress,
          marketValueInDollars: '',
          userAmount: (accountInfo.amount).toString(),
          logoURIbase64: tokenInfo?.logoURI ?? '',
        };

        listOfMints.push(mintAddress);
        tokenInfoPreviews.push(info); 
      }
    });

    // fetch jupiter API for token prices
    const priceData = await (await fetch('https://api.jup.ag/price/v2?ids=' + listOfMints.join(','))).json();

    // Setting balance variable for total wallet balance
    let balance: number = 0;

    // Calculating total wallet balance and coins live data
    for (const token of tokenInfoPreviews) {
      const priceNumber = parseFloat(priceData.data[token.address]?.price ?? '0.00');

      token.marketValueInDollars = priceNumber.toFixed(3);

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
  
    await connection.confirmTransaction(airdropSignature);
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
        coinName: additionalInfo?.name ?? '',
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

export const getAllTradeableTokens = async (): Promise<TokenInfo[]> => {
  const tokenListProvider = await new TokenListProvider().resolve();
  const jupiterQuoteApi = createJupiterApiClient();

  const tradeableMints = await jupiterQuoteApi.tokensGet();

  let tokenList =  tokenListProvider.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();

  tokenList = tokenList.filter(token => tradeableMints.includes(token.address));

  return tokenList;
}

export const getAllAvailableTokens = async (): Promise<TokenInfo[]> => {
  const tokenListProvider = await new TokenListProvider().resolve();

  return tokenListProvider.filterByClusterSlug(process.env.EXPO_PUBLIC_ACTIVE_CLUSTER ?? '').getList();
}

export const getSelectedCoinAmount = async (coinMint: string) => {
  try{
    if (coinMint === 'SOL'){
      coinMint = SOL_MINT;
    }

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

export const getMinimumStakeAmount = async () => {
  const connection = getWalletConnection();

  const minimumRent = await connection.getMinimumBalanceForRentExemption(
    StakeProgram.space
  );

  return minimumRent / LAMPORTS_PER_SOL;
};

export const stakeSolana = async (inputAmount: number) => {
  const connection = getWalletConnection();

  const { current, delinquent } = await connection.getVoteAccounts();

  // Getting low comission validators
  var filteredValidators = current.filter(validator => validator.commission <= 10);

  for (var i: number = 1; i <= 10; i+=1) {
    if (filteredValidators.length > 0) {
      break;
    }

    filteredValidators = current.filter(validator => validator.commission <= 10 * i);
  }

  if (filteredValidators.length === 0) {
    throw new Error('No validators found.');
  }

  filteredValidators = filteredValidators.sort((a, b) => b.activatedStake - a.activatedStake);

  // Getting wallet and stake account
  const wallet = Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));
  const stakeAccount = Keypair.generate();

  // Calculating amount to stake
  const amountToStake = inputAmount * LAMPORTS_PER_SOL;

  // Creating stake account
  const createStakeAccountTx = StakeProgram.createAccount({
    authorized: new Authorized(wallet.publicKey, wallet.publicKey),
    fromPubkey: wallet.publicKey,
    lamports: amountToStake,
    lockup: new Lockup(0, 0, wallet.publicKey),
    stakePubkey: stakeAccount.publicKey,
  });
  
  const createStakeAccountTxId = await sendAndConfirmTransaction(
    connection,
    createStakeAccountTx,
    [
      wallet,
      stakeAccount,
    ]
  );
  console.log(`Stake account created. Tx Id: ${createStakeAccountTxId}`);

  // Getting selected validator pubkey
  const selectedValidatorPubkey = new PublicKey(filteredValidators[0].votePubkey);

  // Delegating stake to a validator
  const delegateTx = StakeProgram.delegate({
    stakePubkey: stakeAccount.publicKey,
    authorizedPubkey: wallet.publicKey,
    votePubkey: selectedValidatorPubkey,
  });

  const delegateTxId = await sendAndConfirmTransaction(connection, delegateTx, [
    wallet,
  ]);

  console.log(
    `Stake account delegated to ${selectedValidatorPubkey}. Tx Id: ${delegateTxId}`
  );
}

export const getAllStakeAccounts = async () => {
  const connection = getWalletConnection();
  const publicKey = getItem('publicKey') ?? '';

  const accounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      filters: [
        {
          memcmp: {
            offset: 12,
            bytes: publicKey
          },
        },
      ],
    }
  );

  const stakingItems: StakingItemData[] = accounts.map(acc => {
    return {
      stakePubkey: acc.pubkey.toBase58(),
      stakeBalance: acc.account.lamports / LAMPORTS_PER_SOL
    }
  });

  const tokens = await getAllTradeableTokens();

  const solanaImageUri = tokens.find(token => token.address === SOL_MINT)?.logoURI ?? '';

  return {
    accounts: stakingItems,
    imageUri: solanaImageUri
  }
}

export const unstakeSolana = async (stakeKey: string, stakeBalance: number) => {
  try {
    console.log('Unstaking:', stakeKey, stakeBalance);

    const connection = getWalletConnection();

    const wallet = Keypair.fromSecretKey(Buffer.from(getItem('privateKey') ?? '', 'hex'));

    const stakePublicKey = new PublicKey(stakeKey);
    
    // Deactivating stake account
    const deactivateTx = StakeProgram.deactivate({
      stakePubkey: stakePublicKey,
      authorizedPubkey: wallet.publicKey,
    });

    const deactivateTxId = await sendAndConfirmTransaction(
      connection,
      deactivateTx,
      [wallet]
    );

    console.log(`Stake account deactivated. Tx Id: ${deactivateTxId}`);

    // Withdraw funds from stake account
    const withdrawTx = StakeProgram.withdraw({
      stakePubkey: stakePublicKey,
      authorizedPubkey: wallet.publicKey,
      toPubkey: wallet.publicKey,
      lamports: stakeBalance * LAMPORTS_PER_SOL,
    });
    
    const withdrawTxId = await sendAndConfirmTransaction(connection, withdrawTx, [
      wallet,
    ]);
    console.log(`Stake account withdrawn. Tx Id: ${withdrawTxId}`);
    
    // Confirm that our stake account balance is now 0
    stakeBalance = await connection.getBalance(stakePublicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.log('Error unstaking:', error);
    throw error;
  }
};

// ALERT: This function works only on mainnet
export const swapTokens = async (fromTokenMint: string, toTokenMint: string, swapAmount: number) => {
  const connection = getWalletConnection();
  const jupiterQuoteApi = createJupiterApiClient();

  const mintInfo = await getMint(connection, new PublicKey(fromTokenMint));
  const LAMPORTS_PER_COIN = Math.pow(10, mintInfo.decimals);

  const amountInLamports = swapAmount * LAMPORTS_PER_COIN;
  
  let quote: QuoteResponse;

  try {
    quote = await jupiterQuoteApi.quoteGet({
      inputMint: fromTokenMint,
      outputMint: toTokenMint,
      amount: amountInLamports,
    });
  } catch (error) {
    throw new Error('Token is not tradeable');
  }

  const serializedQuote = await jupiterQuoteApi.swapPost({
    swapRequest: {
      userPublicKey: getItem('publicKey') ?? '',
      wrapAndUnwrapSol: true,
      quoteResponse: quote
    }
  });

  const swapTransactionBuf = Buffer.from(serializedQuote.swapTransaction, 'base64');
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  const latestBlockHash = await connection.getLatestBlockhash();
  const rawTransaction = transaction.serialize();

  let txid: string;

  try {
    txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2
    });
  } catch (error) {
    throw new Error('You do not have enough tokens to swap or the input is not valid.');
  }

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txid
  });
}

export {
  TokenInfoPreview,
  WalletInfo,
  TransactionHistoryData,
  TokenInfo,
  StakingItemData
}
// src/config/SolanaConfig.ts

import { Connection, clusterApiUrl} from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'));

export default connection;

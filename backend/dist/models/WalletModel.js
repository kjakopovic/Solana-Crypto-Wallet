"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSol = exports.getBalance = exports.createWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const SolanaConfig_1 = __importDefault(require("../config/SolanaConfig"));
const Logger_1 = __importDefault(require("../config/Logger"));
const className = 'WalletModel';
const createWallet = () => {
    Logger_1.default.info('Creating a new wallet', { className });
    const keypair = web3_js_1.Keypair.generate();
    const wallet = {
        publicKey: keypair.publicKey.toString(),
        secretKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
    Logger_1.default.info('Wallet created', { className });
    return wallet;
};
exports.createWallet = createWallet;
const getBalance = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info('Getting balance of a wallet', { className });
    try {
        const balance = yield SolanaConfig_1.default.getBalance(new web3_js_1.PublicKey(publicKey));
        Logger_1.default.info({ message: 'Balance fetched: ' + (balance / web3_js_1.LAMPORTS_PER_SOL) + ' SOL', className });
        return balance / web3_js_1.LAMPORTS_PER_SOL;
    }
    catch (error) {
        Logger_1.default.error({ message: 'Error fetching balance', error, className });
        throw new Error('Error fetching balance');
    }
});
exports.getBalance = getBalance;
const transferSol = (fromKeypair, toPublicKey, amount) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info('Transferring SOL from one wallet to another', { className });
    try {
        const toPublicKeyInstance = new web3_js_1.PublicKey(toPublicKey);
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKeyInstance,
            lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
        }));
        const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(SolanaConfig_1.default, transaction, [fromKeypair]);
        Logger_1.default.info('Transaction successful', { className });
        return signature;
    }
    catch (error) {
        Logger_1.default.error({ message: 'Error transferring SOL', error, className });
        throw new Error('Error transferring SOL');
    }
});
exports.transferSol = transferSol;

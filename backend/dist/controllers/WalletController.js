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
exports.transferSolController = exports.getBalanceController = exports.createWalletController = void 0;
const WalletModel_1 = require("../models/WalletModel");
const web3_js_1 = require("@solana/web3.js");
const Logger_1 = __importDefault(require("../config/Logger"));
const className = 'WalletController';
const createWalletController = (req, res) => {
    Logger_1.default.info('Creating a new wallet', { className });
    try {
        const wallet = (0, WalletModel_1.createWallet)();
        Logger_1.default.info('Wallet created', { className });
        return res.status(200).json(wallet);
    }
    catch (error) {
        Logger_1.default.error({ message: 'Error creating wallet', error, className });
        return res.status(500).json({ message: 'Error creating wallet' });
    }
};
exports.createWalletController = createWalletController;
const getBalanceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info('Getting wallet balance', { className });
    const { publicKey } = req.params;
    try {
        const balance = yield (0, WalletModel_1.getBalance)(publicKey);
        Logger_1.default.info('Balance fetched', { className });
        return res.status(200).json({ balance });
    }
    catch (error) {
        Logger_1.default.error({ message: 'Error fetching balance', error, className });
        return res.status(500).json({ message: 'Error fetching balance' });
    }
});
exports.getBalanceController = getBalanceController;
const transferSolController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info('Transferring SOL from one wallet to another', { className });
    const { fromSecretKey, toPublicKey, amount } = req.body;
    try {
        const fromKeypair = web3_js_1.Keypair.fromSecretKey(Buffer.from(fromSecretKey, 'hex'));
        const signature = yield (0, WalletModel_1.transferSol)(fromKeypair, toPublicKey, amount);
        Logger_1.default.info('Transaction successful', { className });
        return res.status(200).json({ signature });
    }
    catch (error) {
        Logger_1.default.error({ message: 'Error transferring SOL', error, className });
        return res.status(500).json({ message: 'Error transferring SOL' });
    }
});
exports.transferSolController = transferSolController;

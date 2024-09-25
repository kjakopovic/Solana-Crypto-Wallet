"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WalletController_1 = require("../controllers/WalletController");
const router = (0, express_1.Router)();
router.post('/createWallet', WalletController_1.createWalletController);
router.get('/getBalance/:publicKey', WalletController_1.getBalanceController);
router.post('/transferSol', WalletController_1.transferSolController);
exports.default = router;

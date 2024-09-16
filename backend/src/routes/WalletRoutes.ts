// src/routes/WalletRoutes.ts

import { Router } from 'express';
import{
    createWalletController,
    getBalanceController,
    transferSolController
} from '../controllers/WalletController';

const router = Router();

router.post('/createWallet', createWalletController);
router.get('/getBalance/:publicKey', getBalanceController);
router.post('/transferSol', transferSolController);


export default router;
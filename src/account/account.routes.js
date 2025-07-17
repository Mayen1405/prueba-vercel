import { Router } from 'express';
import {
    getAccounts,
    getAllAccounts,
    registerAccount,
    deleteAccount
} from './account.controller.js';
import {
    registerAccountValidator,
    deleteAccountValidator,
    getAccountsValidator,
    getMyAccountsValidator
} from '../middlewares/account-validator.js';

const router = Router();

router.get('/getMyAccounts', getMyAccountsValidator, getAccounts);

router.get('/getAccounts', getAccountsValidator, getAllAccounts);

router.post('/createAccount', registerAccountValidator, registerAccount);


router.delete('/deleteAccount/:id', deleteAccountValidator, deleteAccount);

export default router;
import { Router } from "express";
import {
    listAccountsByTransactionCount,
    makeDeposit,
    modifyDepositAmount,
    revertDeposit,
    getAccountSummary,
    makeTransfer,
    buyProduct,
    getAllDeposits 
} from "./transaction.controller.js";
import {
    makeDepositValidator,
    modifyDepositAmountValidator,
    revertDepositValidator,
    makeTransferValidator,
    getAccountSummaryValidator,
    listAccountsByTransactionCountValidator,
    buyProductValidator,
    getAllDepositsValidator 
} from "../middlewares/transaction-validator.js";

const router = Router();

router.get("/accounts-by-transaction-count", listAccountsByTransactionCountValidator, listAccountsByTransactionCount );

router.post("/deposit", makeDepositValidator,makeDeposit );

router.get("/deposits", getAllDepositsValidator, getAllDeposits);

router.put("/deposit/modify",modifyDepositAmountValidator,modifyDepositAmount);

router.post("/deposit/revert",revertDepositValidator,revertDeposit);

router.get("/summary/:accountId",getAccountSummaryValidator,getAccountSummary);

router.post("/transfer",makeTransferValidator,makeTransfer);

router.post("/purchase", buyProductValidator, buyProduct);


export default router;

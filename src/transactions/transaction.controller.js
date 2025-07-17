import Transaction from './transaction.model.js';
import Account from '../account/account.model.js';
import Product from '../product/product.model.js';
import mongoose from 'mongoose';

export const listAccountsByTransactionCount = async (req, res) => {
    try {
        const { order = 'desc' } = req.query;
        const sortOrder = order === 'asc' ? 1 : -1;

        const accounts = await Transaction.aggregate([
            { $group: { _id: "$toAccount", count: { $sum: 1 } } },
            { $sort: { count: sortOrder } },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "account"
                }
            },
            { $unwind: "$account" }
        ]);

        res.json({ success: true, accounts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const makeDeposit = async (req, res) => {
    try {
        const { toNumberAccount, amount } = req.body;
        const account = await Account.findOne({ numberAccount: toNumberAccount });
        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        account.balance = Number((account.balance + Number(amount)).toFixed(2));
        await account.save();

        const transaction = await Transaction.create({
            type: 'DEPOSIT',
            amount,
            toAccount: account._id,
            performedBy: req.usuario._id
        });

        res.json({ success: true, transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const modifyDepositAmount = async (req, res) => {
    try {
        const { transactionId, newAmount } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'ACTIVE')
            return res.status(404).json({ success: false, message: "Active deposit not found" });

        const account = await Account.findById(transaction.toAccount);
        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        account.balance = account.balance - transaction.amount + newAmount;
        await account.save();

        transaction.amount = newAmount;
        await transaction.save();

        res.json({ success: true, transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const revertDeposit = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'ACTIVE')
            return res.status(404).json({ success: false, message: "Active deposit not found" });

        const now = new Date();
        const diff = (now - transaction.createdAt) / 1000;
        if (diff > 900)
            return res.status(400).json({ success: false, message: "Deposit can only be reverted within 15 minutes" });

        const account = await Account.findById(transaction.toAccount);
        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        account.balance -= transaction.amount;
        await account.save();

        transaction.status = 'REVERSED';
        transaction.reversedAt = now;
        await transaction.save();

        res.json({ success: true, transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAccountSummary = async (req, res) => {
    try {
        const { accountId  } = req.params;
        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        const transactions = await Transaction.find({
            $or: [{ fromAccount: accountId }, { toAccount: accountId }]
        }).sort({ createdAt: -1 });

        res.json({ success: true, balance: account.balance, transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const makeTransfer = async (req, res) => {
    try {
        const { fromNumberAccount, toNumberAccount, amount } = req.body;
        if (fromNumberAccount === toNumberAccount)
            return res.status(400).json({ success: false, message: "Cannot transfer to the same account" });

        if (amount > 2000)
            return res.status(400).json({ success: false, message: "Cannot transfer more than Q2000 per transaction" });

        const fromAccount = await Account.findOne({ numberAccount: fromNumberAccount });
        const toAccount = await Account.findOne({ numberAccount: toNumberAccount });

        if (!fromAccount || !toAccount)
            return res.status(404).json({ success: false, message: "Account not found" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalToday = await Transaction.aggregate([
            {
                $match: {
                    fromAccount: fromAccount._id,
                    type: 'OUT_TRANSFER',
                    createdAt: { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalTransferred = totalToday[0]?.total || 0;
        if (totalTransferred + amount > 10000)
            return res.status(400).json({ success: false, message: "Daily transfer limit exceeded (Q10,000)" });

        if (fromAccount.balance < amount)
            return res.status(400).json({ success: false, message: "Insufficient funds" });

        fromAccount.balance -= amount;
        toAccount.balance += amount;
        await fromAccount.save();
        await toAccount.save();

        const outTransfer = await Transaction.create({
            type: 'OUT_TRANSFER',
            amount,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            performedBy: req.usuario._id
        });

        const inTransfer = await Transaction.create({
            type: 'IN_TRANSFER',
            amount,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            performedBy: req.usuario._id
        });

        res.json({ success: true, outTransfer, inTransfer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const buyProduct = async (req, res) => {
    try {
        const { productId, fromAccountId  } = req.body;
        const user = req.usuario;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const fromAccount = await Account.findById(fromAccountId);
        if (!fromAccount) {
            return res.status(404).json({ success: false, message: "Source account not found" });
        }

        if (fromAccount.user.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "You do not have permission to use this account" });
        }
        if (product.stock <= 0) {
            return res.status(400).json({ success: false, message: "Product out of stock" });
        }
        if (fromAccount.balance < product.price) {
            return res.status(400).json({ success: false, message: "Insufficient funds" });
        }

        fromAccount.balance -= product.price;
        product.stock -= 1;

        await fromAccount.save();
        await product.save();

        const transaction = await Transaction.create({
            type: 'PURCHASE',
            amount: product.price,
            fromAccount: fromAccountId,
            performedBy: user._id
        });

        res.json({ success: true, message: "Purchase successful", transaction });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllDeposits = async (req, res) => {
    try {
        const deposits = await Transaction.find({ type: 'DEPOSIT' })
            .populate({
                path: 'toAccount',
                select: 'numberAccount typeAccount user',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate('performedBy', 'name username')
            .sort({ createdAt: -1 });

        if (!deposits) {
            return res.status(404).json({ success: false, message: "No deposits found" });
        }

        res.json({ success: true, deposits });
    } catch (err) {
        console.error("Error fetching all deposits:", err);
        res.status(500).json({ success: false, message: "Server error while fetching deposits", error: err.message });
    }
};
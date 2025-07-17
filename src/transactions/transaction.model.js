import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    type: {
        type: String,
        enum: ['DEPOSIT', 'IN_TRANSFER', 'OUT_TRANSFER', 'WITHDRAWAL', 'PURCHASE'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    fromAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    toAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    performedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'REVERSED'],
        default: 'ACTIVE'
    },
    reversedAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
});

transactionSchema.methods.toJSON = function() {
    const { __v, _id, ...transaction } = this.toObject();
    transaction.tid = _id;
    return transaction;
};


export default model('Transaction', transactionSchema);

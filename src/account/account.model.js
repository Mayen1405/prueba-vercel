import mongoose, { Schema } from "mongoose";

const accountSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    numberAccount: {
        type: String,
        required: [true, "Account number is required"],
        unique: true,
    },
    typeAccount: {
        type: String,
        enum: ["AHORRO", "MONETARIO", "CREDITO"],
        required: [true, "Account type is required"]
    },
    balance: {
        type: Number,
        required: [true, "Balance is required"],
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
})

accountSchema.methods.toJSON = function() {
    const { __v, _id, ...account } = this.toObject();
    account.uid = _id;
    return account;
}

export default mongoose.model("Account", accountSchema);
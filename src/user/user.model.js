import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    accounts:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }],
        default: []
    },
    dpi: {
        type: String,
        required: [true, 'DPI is required'],
        unique: true,
        minlength: [13, 'DPI must be at least 13 characters long'],
        maxlength: [13, 'DPI must not exceed 13 characters'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    workName: {
        type: String,
        required: [true, 'Work name is required'],
        trim: true
    },
    monthlyIncome: {
        type: Number,
        required: [true, 'Monthly income is required'],
        min: [0, 'Monthly income must be a positive number']
    },
    favorites: {
        type: [{
            account: {
                type: Schema.Types.ObjectId,
                ref: 'Account',
                required: true
            },
            alias: {
                type: String,
                trim: true
            }
        }],
        default: []
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default model('User', userSchema);
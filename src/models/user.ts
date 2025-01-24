import mongoose, { Document, Model } from "mongoose";
import { IUser } from '../utils/types';
import bcrypt from 'bcrypt';

// Define the extended UserDocument interface with instance methods
export interface UserDocument extends IUser, Document {
    isPasswordMatched(password: string): Promise<boolean>;
}

// Define the extended UserModel interface with static methods
export interface UserModel extends Model<UserDocument> {
    findUserByEmail(email: string): Promise<UserDocument | null>;
    hashedPassword(password: string): Promise<string>;
}


const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 18,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 3,
        max: 18
    },
    role: {
        type: String,
        enum: ['Admin', 'Author', 'Reader'],
        default: 'Reader'
    },
    bio: {
        type: String,
        max: 200,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: []
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: []
    }],
    token: {
        type: String,
        default: ''
    },

}, { timestamps: true });


UserSchema.pre('save', function (next) {
    if (this.role === 'Admin') {
        this.isBlocked = false; //  always remain false for admin
    }
    next();
});

UserSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

UserSchema.methods.isPasswordMatched = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.statics.findUserByEmail = async function (email) {
    return await this.findOne({ email: email });
}


const User = mongoose.model<UserDocument, UserModel>('Users', UserSchema);

export default User;
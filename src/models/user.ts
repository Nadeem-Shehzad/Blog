import mongoose,{Document} from "mongoose";
import {IUser} from '../utils/types';

export interface UserDocument extends IUser,Document{}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model<UserDocument>('Users',userSchema);

export default User;
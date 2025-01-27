
import { mSignUp, mSignIn, mSignOut } from '../controllers/user';
import { qGetReaders } from '../controllers/user';

export const userResolver = {
    Query: {
        getReaders: qGetReaders
    },

    Mutation: {
        signup: mSignUp,
        signin: mSignIn,
        signout: mSignOut
    }
}

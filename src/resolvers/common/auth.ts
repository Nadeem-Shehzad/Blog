
import { mSignUp, mSignIn, mSignOut } from '../../controllers/common/user';
import { qGetReaders } from '../../controllers/common/user';

export const userResolver = {

    Mutation: {
        signup: mSignUp,
        signin: mSignIn,
        signout: mSignOut
    }
}

import { mSignUp, mSignIn } from '../controllers/user';
import { qGetUsers } from '../controllers/user';

export const userResolver = {
    Query: {
        getUsers: qGetUsers
    },

    Mutation: {
        signup: mSignUp,
        signin: mSignIn
    }
}


import { mSignUp, mSignIn, mSignOut } from '../../controllers/common/user';


export const authResolver = {

    Mutation: {
        signup: mSignUp,
        signin: mSignIn,
        signout: mSignOut
    }
}
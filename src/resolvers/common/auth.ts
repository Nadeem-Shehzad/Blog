
import {
    mSignUp, mSignIn, mSignOut, mUpdateProfile, mResetPassword,
    mForgotPassword, mDeleteAccount, mResetPasswordByEmail
} from '../../controllers/common/auth';


export const authResolver = {

    Mutation: {
        signup: mSignUp,
        signin: mSignIn,
        signout: mSignOut,
        updateProfile: mUpdateProfile,
        resetPassword: mResetPassword,
        deleteAccount: mDeleteAccount,
        forgotPassword: mForgotPassword,
        resetPasswordByEmail: mResetPasswordByEmail
    }
}
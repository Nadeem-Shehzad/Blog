import {
    qGetReaders, mBlockUser, mUnblockUser,
    mDeleteBlog, mDeleteUser,mDeleteComment
} from '../../controllers/admin/admin';


export const adminResolver = {
    Query: {
        getReaders: qGetReaders
    },

    Mutation: {
        blockUser: mBlockUser,
        unBlockUser: mUnblockUser,
        deleteCommentByadmin: mDeleteComment,
        deleteBlogByAdmin: mDeleteBlog,
        deleteUserAccount: mDeleteUser
    }
}

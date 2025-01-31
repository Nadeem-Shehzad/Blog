
import { MyContext, IQueryResponse } from '../../utils/types';
import User from '../../models/user';
import { compose, authMiddleware, checkRole, ErrorHandling } from '../../middlewares/common';


export const qGetReaders = compose(ErrorHandling, authMiddleware, checkRole(['Admin']))(async (_: any, __: any, context: MyContext): Promise<IQueryResponse> => {

    const users = await User.find({ role: { $nin: ['Admin', 'Author'] } });
    return { success: true, message: 'Total Readers', data: users };
});
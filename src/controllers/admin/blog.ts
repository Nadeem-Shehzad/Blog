
import { MyContext, IQueryResponse } from '../../utils/types';
import User from '../../models/user';


export const qGetReaders = async (_: any, __: any, contextValue: MyContext): Promise<IQueryResponse> => {

    const { userId } = contextValue;
    if (!userId) {
        return { success: false, message: 'You must logged in!.', data: null };
    }

    const { role } = contextValue;
    if (role?.toString() !== 'Admin') {
        return { success: false, message: 'Access denied!.', data: null };
    }

    try {
        const users = await User.find({ role: { $nin: ['Admin', 'Author'] } });
        return { success: true, message: 'User Data', data: users };

    } catch (error) {
        return { success: true, message: 'Data fetching Error!', data: null }
    }
}
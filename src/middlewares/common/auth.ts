import { MyContext } from '../../utils/types';

export const authMiddleware = (resolverFunction: Function) => {
  return async (parent: any, args: any, context: MyContext, info: any) => {
    if (!context.userId) {
      return {
        success: false,
        message: "Please login to perform this action",
        data: null
      };
    }

    return resolverFunction(parent, args, context, info);
  };
};
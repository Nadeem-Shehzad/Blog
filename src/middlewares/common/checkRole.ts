import { MyContext } from '../../utils/types';


export const checkRole = (allowedRoles: string[]) => {
    return (resolver: Function) => {
        return async (parent: any, args: any, context: MyContext, info: any) => {
            const userRole = context.role ?? null;

            if (!userRole || !allowedRoles.includes(userRole)) {
                return {
                    success: false,
                    message: `You need ${allowedRoles.join(" or ")} access!`,
                    data: null
                };
            }

            return resolver(parent, args, context, info);
        };
    };
};
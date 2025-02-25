import { MyContext } from '.././utils/types';
import Blog from '../models/blog';
import User from '../models/user';


export const compose = (...middleware: Function[]) => {
    return middleware.reduce((a, b) => (arg: any) => a(b(arg)));
}


export const authMiddleware = (resolverFunction: Function) => {
    return async (parent: any, args: any, context: MyContext, info: any) => {
        if (!context.userId) {
            throw new Error("Authentication required");
        }

        return resolverFunction(parent, args, context, info);
    };
};


export const checkRole = (allowedRoles: string[]) => {
    return (resolver: Function) => {
        return async (parent: any, args: any, context: MyContext, info: any) => {
            const userRole = context.role ?? null;

            if (!userRole || !allowedRoles.includes(userRole)) {
                throw new Error(`You need ${allowedRoles.join(" or ")} access!`);
            }

            return resolver(parent, args, context, info);
        };
    };
};


export const IsBlogExists = (resolver: Function) => {
    return async (parent: any, args: any, context: MyContext, info: any) => {
        const blog = await Blog.findById(args.blogId);

        if (!blog) {
            throw new Error('Blog not exists!');
        }
        return resolver(parent, args, context, info);
    }
}


export const IsUserExists = (resolver: Function) => {
    return async (parent: any, args: any, context: MyContext, info: any) => {
        const user = await User.findById(args.userId);

        if (!user) {
            throw new Error('User not exists!');
        }
        return resolver(parent, args, context, info);
    }
}


export const ErrorHandling = (resolver: Function) => {
    return async (parent: any, args: any, context: MyContext, info: any) => {
        try {
            return await resolver(parent, args, context, info);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return { success: false, message: error.message, data: null };
            } else {
                console.error("Unexpected error:", error);
                return { success: false, message: 'Server error occurred!', data: null };
            }
        }
    };
}


// export const IsBlocked = (resolver: Function) => {
//     return async (parent: any, args: any, context: MyContext, info: any) => {
//         if (!context.userId) { // write here isblock check func.
//             throw new Error('Sorry, You are blocked by admin');
//         }
//         return resolver(parent, args, context, info);
//     }
// }
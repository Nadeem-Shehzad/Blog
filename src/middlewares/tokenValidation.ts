import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { CustomJwtPayload, MyContext } from '../utils/types'
import { IncomingMessage } from 'http';

export const tokenValidation = async ({ req }: { req: IncomingMessage }): Promise<MyContext> => {
    const expressReq = req as Request;
    const { authorization } = expressReq.headers;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    if (authorization) {
        try {
            const token = authorization.startsWith('Bearer ')
                ? authorization.slice(7).trim()
                : authorization;
    
            const decoded = jwt.verify(token,secret) as CustomJwtPayload; 
            
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            //console.error('Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    
    return {};
};
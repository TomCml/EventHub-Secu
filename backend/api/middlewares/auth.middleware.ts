import { Request, Response, NextFunction } from 'express';
import { validateSignature } from '../../utility/password.utility';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const isAuthorized = validateSignature(req);

        if (isAuthorized) {
            return next();
        }

        return res.status(401).json({ message: 'Not Authorized' });
    } catch (error) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
}

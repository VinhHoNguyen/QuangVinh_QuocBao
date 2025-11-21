import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AppError } from './errorHandler';
import { UserRole } from '../models/types';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || UserRole.CUSTOMER,
    };

    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AppError('Access forbidden', 403));
    }

    next();
  };
};

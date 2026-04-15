import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from '../utils/AppError';

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

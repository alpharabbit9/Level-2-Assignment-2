import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';
import { query } from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(401, 'Not authorized to access this route. Please log in.'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      
      const { rows } = await query('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        return next(new AppError(401, 'The user belonging to this token does no longer exist.'));
      }

      req.user = rows[0];
      next();
    } catch (error) {
      return next(new AppError(401, 'Not authorized, token failed'));
    }
  } catch (error) {
    next(error);
  }
};

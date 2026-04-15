import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle PG Unique Constraint Error
  if (err.code === '23505') {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Handle PG Foreign Key Constraint Error
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Cannot complete operation, referenced record does not exist or restrict deletion flag check failed';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.detail || err.message,
  });
};

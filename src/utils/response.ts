import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: { success: boolean; message: string; data?: T }
) => {
  res.status(statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

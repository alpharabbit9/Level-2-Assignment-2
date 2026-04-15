import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as usersService from './users.service';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { AppError } from '../../utils/AppError';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  sendResponse(res, 200, {
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

export const updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.userId as string, 10);
  
  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    throw new AppError(403, 'You can only update your own profile');
  }

  const updatedUser = await usersService.updateUser(userId, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string, 10);
  await usersService.deleteUser(userId);
  sendResponse(res, 200, {
    success: true,
    message: 'User deleted successfully',
  });
});

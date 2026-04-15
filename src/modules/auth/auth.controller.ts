import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as authService from './auth.service';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);

  sendResponse(res, 201, {
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const signin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signin(req.body);

  sendResponse(res, 200, {
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

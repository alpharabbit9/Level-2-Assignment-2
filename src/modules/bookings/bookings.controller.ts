import { Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as bookingsService from './bookings.service';
import { AuthRequest } from '../../middlewares/authMiddleware';

export const createBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const booking = await bookingsService.createBooking(userId, req.body);
  
  sendResponse(res, 201, {
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

export const getAllBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const bookings = await bookingsService.getAllBookings(userId, role);

  sendResponse(res, 200, {
    success: true,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});

export const updateBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const bookingId = parseInt(req.params.bookingId as string, 10);
  const userId = req.user!.id;
  const role = req.user!.role;

  const updatedBooking = await bookingsService.updateBooking(bookingId, req.body, userId, role);

  sendResponse(res, 200, {
    success: true,
    message: 'Booking updated successfully',
    data: updatedBooking,
  });
});

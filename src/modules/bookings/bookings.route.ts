import { Router } from 'express';
import { createBooking, getAllBookings, updateBooking } from './bookings.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, getAllBookings);
router.put('/:bookingId', protect, updateBooking);

export const bookingsRoutes = router;

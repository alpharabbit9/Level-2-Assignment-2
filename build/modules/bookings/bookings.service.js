"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.getAllBookings = exports.createBooking = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const createBooking = async (userId, bookingData) => {
    const { vehicle_id, rent_start_date, rent_end_date } = bookingData;
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    if (end <= start) {
        throw new AppError_1.AppError(400, 'rent_end_date must be after rent_start_date');
    }
    const daysMs = end.getTime() - start.getTime();
    const days = Math.ceil(daysMs / (1000 * 60 * 60 * 24));
    const client = await (0, db_1.getClient)();
    try {
        await client.query('BEGIN');
        // Check vehicle availability
        const { rows: vehicleRows } = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
        if (vehicleRows.length === 0) {
            throw new AppError_1.AppError(404, 'Vehicle not found');
        }
        const vehicle = vehicleRows[0];
        if (vehicle.availability_status !== 'available') {
            throw new AppError_1.AppError(400, 'Vehicle is not available for booking');
        }
        const total_price = vehicle.daily_rent_price * days;
        // Create booking
        const { rows: bookingRows } = await client.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`, [userId, vehicle_id, rent_start_date, rent_end_date, total_price]);
        // Update vehicle status
        await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['booked', vehicle_id]);
        await client.query('COMMIT');
        return bookingRows[0];
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.createBooking = createBooking;
const getAllBookings = async (userId, role) => {
    let queryString = 'SELECT * FROM bookings';
    const params = [];
    if (role !== 'admin') {
        queryString += ' WHERE customer_id = $1';
        params.push(userId);
    }
    const { rows } = await (0, db_1.query)(queryString, params);
    return rows;
};
exports.getAllBookings = getAllBookings;
const updateBooking = async (bookingId, updateData, userId, role) => {
    const { status } = updateData;
    const client = await (0, db_1.getClient)();
    try {
        await client.query('BEGIN');
        const { rows: bookingRows } = await client.query('SELECT * FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
        if (bookingRows.length === 0) {
            throw new AppError_1.AppError(404, 'Booking not found');
        }
        const booking = bookingRows[0];
        // Customer can cancel ONLY before start date
        if (role === 'customer') {
            if (booking.customer_id !== userId) {
                throw new AppError_1.AppError(403, 'You do not have permission to update this booking');
            }
            if (status !== 'cancelled') {
                throw new AppError_1.AppError(400, 'Customers can only cancel bookings');
            }
            if (new Date() >= new Date(booking.rent_start_date)) {
                throw new AppError_1.AppError(400, 'Cannot cancel booking after start date');
            }
        }
        // Admin can mark booking as returned
        if (role === 'admin' && status && !['cancelled', 'returned'].includes(status)) {
            throw new AppError_1.AppError(400, 'Invalid status update');
        }
        const { rows: updatedRows } = await client.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, bookingId]);
        // Status effects
        if (['cancelled', 'returned'].includes(status)) {
            await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['available', booking.vehicle_id]);
        }
        await client.query('COMMIT');
        return updatedRows[0];
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.updateBooking = updateBooking;

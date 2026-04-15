"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const getAllUsers = async () => {
    const { rows } = await (0, db_1.query)('SELECT id, name, email, phone, role FROM users');
    return rows;
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const { rows } = await (0, db_1.query)('SELECT id, name, email, phone, role FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
        throw new AppError_1.AppError(404, 'User not found');
    }
    return rows[0];
};
exports.getUserById = getUserById;
const updateUser = async (id, updateData) => {
    const { name, phone } = updateData;
    const { rows } = await (0, db_1.query)('UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone) WHERE id = $3 RETURNING id, name, email, phone, role', [name, phone, id]);
    if (rows.length === 0) {
        throw new AppError_1.AppError(404, 'User not found');
    }
    return rows[0];
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const { rows: activeBookings } = await (0, db_1.query)('SELECT id FROM bookings WHERE customer_id = $1 AND status = $2', [id, 'active']);
    if (activeBookings.length > 0) {
        throw new AppError_1.AppError(400, 'Cannot delete user with active bookings');
    }
    const { rowCount } = await (0, db_1.query)('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) {
        throw new AppError_1.AppError(404, 'User not found');
    }
};
exports.deleteUser = deleteUser;

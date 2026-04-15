"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getAllVehicles = exports.createVehicle = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const createVehicle = async (vehicleData) => {
    const { vehicle_name, type, registration_number, daily_rent_price } = vehicleData;
    const { rows: existingVehicles } = await (0, db_1.query)('SELECT registration_number FROM vehicles WHERE registration_number = $1', [registration_number]);
    if (existingVehicles.length > 0) {
        throw new AppError_1.AppError(400, 'Registration number already exists');
    }
    const { rows } = await (0, db_1.query)('INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price) VALUES ($1, $2, $3, $4) RETURNING *', [vehicle_name, type, registration_number, daily_rent_price]);
    return rows[0];
};
exports.createVehicle = createVehicle;
const getAllVehicles = async () => {
    const { rows } = await (0, db_1.query)('SELECT * FROM vehicles');
    return rows;
};
exports.getAllVehicles = getAllVehicles;
const getVehicleById = async (id) => {
    const { rows } = await (0, db_1.query)('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (rows.length === 0) {
        throw new AppError_1.AppError(404, 'Vehicle not found');
    }
    return rows[0];
};
exports.getVehicleById = getVehicleById;
const updateVehicle = async (id, vehicleData) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;
    const { rows } = await (0, db_1.query)(`UPDATE vehicles 
     SET vehicle_name = COALESCE($1, vehicle_name),
         type = COALESCE($2, type),
         registration_number = COALESCE($3, registration_number),
         daily_rent_price = COALESCE($4, daily_rent_price),
         availability_status = COALESCE($5, availability_status)
     WHERE id = $6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    if (rows.length === 0) {
        throw new AppError_1.AppError(404, 'Vehicle not found');
    }
    return rows[0];
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (id) => {
    const { rows: activeBookings } = await (0, db_1.query)('SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2', [id, 'active']);
    if (activeBookings.length > 0) {
        throw new AppError_1.AppError(400, 'Cannot delete vehicle with active bookings');
    }
    const { rowCount } = await (0, db_1.query)('DELETE FROM vehicles WHERE id = $1', [id]);
    if (rowCount === 0) {
        throw new AppError_1.AppError(404, 'Vehicle not found');
    }
};
exports.deleteVehicle = deleteVehicle;

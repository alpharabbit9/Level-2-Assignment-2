import { query } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const createVehicle = async (vehicleData: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price } = vehicleData;

  const { rows: existingVehicles } = await query('SELECT registration_number FROM vehicles WHERE registration_number = $1', [registration_number]);
  if (existingVehicles.length > 0) {
    throw new AppError(400, 'Registration number already exists');
  }

  const { rows } = await query(
    'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price) VALUES ($1, $2, $3, $4) RETURNING *',
    [vehicle_name, type, registration_number, daily_rent_price]
  );
  return rows[0];
};

export const getAllVehicles = async () => {
  const { rows } = await query('SELECT * FROM vehicles');
  return rows;
};

export const getVehicleById = async (id: number) => {
  const { rows } = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (rows.length === 0) {
    throw new AppError(404, 'Vehicle not found');
  }
  return rows[0];
};

export const updateVehicle = async (id: number, vehicleData: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;

  const { rows } = await query(
    `UPDATE vehicles 
     SET vehicle_name = COALESCE($1, vehicle_name),
         type = COALESCE($2, type),
         registration_number = COALESCE($3, registration_number),
         daily_rent_price = COALESCE($4, daily_rent_price),
         availability_status = COALESCE($5, availability_status)
     WHERE id = $6 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );
  
  if (rows.length === 0) {
    throw new AppError(404, 'Vehicle not found');
  }
  return rows[0];
};

export const deleteVehicle = async (id: number) => {
  const { rows: activeBookings } = await query('SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2', [id, 'active']);
  if (activeBookings.length > 0) {
    throw new AppError(400, 'Cannot delete vehicle with active bookings');
  }

  const { rowCount } = await query('DELETE FROM vehicles WHERE id = $1', [id]);
  if (rowCount === 0) {
    throw new AppError(404, 'Vehicle not found');
  }
};

import { query } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const getAllUsers = async () => {
  const { rows } = await query('SELECT id, name, email, phone, role FROM users');
  return rows;
};

export const getUserById = async (id: number) => {
  const { rows } = await query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [id]);
  if (rows.length === 0) {
    throw new AppError(404, 'User not found');
  }
  return rows[0];
};

export const updateUser = async (id: number, updateData: any) => {
  const { name, phone } = updateData;
  const { rows } = await query(
    'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone) WHERE id = $3 RETURNING id, name, email, phone, role',
    [name, phone, id]
  );
  if (rows.length === 0) {
    throw new AppError(404, 'User not found');
  }
  return rows[0];
};

export const deleteUser = async (id: number) => {
  const { rows: activeBookings } = await query('SELECT id FROM bookings WHERE customer_id = $1 AND status = $2', [id, 'active']);
  if (activeBookings.length > 0) {
    throw new AppError(400, 'Cannot delete user with active bookings');
  }

  const { rowCount } = await query('DELETE FROM users WHERE id = $1', [id]);
  if (rowCount === 0) {
    throw new AppError(404, 'User not found');
  }
};

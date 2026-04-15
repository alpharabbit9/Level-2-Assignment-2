import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { config } from '../../config/env';

export const signup = async (userData: any) => {
  const { name, email, password, phone, role } = userData;

  if (password.length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters');
  }

  const { rows: existingUsers } = await query('SELECT email FROM users WHERE email = $1', [email]);
  if (existingUsers.length > 0) {
    throw new AppError(400, 'Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'admin' ? 'admin' : 'customer';

  const { rows } = await query(
    'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
    [name, email.toLowerCase(), hashedPassword, phone, userRole]
  );

  return rows[0];
};

export const signin = async (credentials: any) => {
  const { email, password } = credentials;

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};

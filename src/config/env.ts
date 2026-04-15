import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret_key_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  db: {
    connectionString: process.env.DATABASE_URL
  }
};

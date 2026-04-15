import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.route';
import { usersRoutes } from './modules/users/users.route';
import { vehiclesRoutes } from './modules/vehicles/vehicles.route';
import { bookingsRoutes } from './modules/bookings/bookings.route';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { AppError } from './utils/AppError';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vehicles', vehiclesRoutes);
app.use('/api/v1/bookings', bookingsRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Vehicle Rental System API is running...');
});

// Unknown Routes handling
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

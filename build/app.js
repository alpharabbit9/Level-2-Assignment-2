"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = require("./modules/auth/auth.route");
const users_route_1 = require("./modules/users/users.route");
const vehicles_route_1 = require("./modules/vehicles/vehicles.route");
const bookings_route_1 = require("./modules/bookings/bookings.route");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const AppError_1 = require("./utils/AppError");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/v1/auth', auth_route_1.authRoutes);
app.use('/api/v1/users', users_route_1.usersRoutes);
app.use('/api/v1/vehicles', vehicles_route_1.vehiclesRoutes);
app.use('/api/v1/bookings', bookings_route_1.bookingsRoutes);
// Root route
app.get('/', (req, res) => {
    res.send('Vehicle Rental System API is running...');
});
// Unknown Routes handling
app.all('*', (req, res, next) => {
    next(new AppError_1.AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
// Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;

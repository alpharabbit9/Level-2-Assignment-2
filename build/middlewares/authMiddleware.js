"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const db_1 = require("../config/db");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError_1.AppError(401, 'Not authorized to access this route. Please log in.'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
            const { rows } = await (0, db_1.query)('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);
            if (rows.length === 0) {
                return next(new AppError_1.AppError(401, 'The user belonging to this token does no longer exist.'));
            }
            req.user = rows[0];
            next();
        }
        catch (error) {
            return next(new AppError_1.AppError(401, 'Not authorized, token failed'));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;

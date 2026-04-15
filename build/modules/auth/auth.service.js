"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const env_1 = require("../../config/env");
const signup = async (userData) => {
    const { name, email, password, phone, role } = userData;
    if (password.length < 6) {
        throw new AppError_1.AppError(400, 'Password must be at least 6 characters');
    }
    const { rows: existingUsers } = await (0, db_1.query)('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
        throw new AppError_1.AppError(400, 'Email is already registered');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'customer';
    const { rows } = await (0, db_1.query)('INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role', [name, email.toLowerCase(), hashedPassword, phone, userRole]);
    return rows[0];
};
exports.signup = signup;
const signin = async (credentials) => {
    const { email, password } = credentials;
    const { rows } = await (0, db_1.query)('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        throw new AppError_1.AppError(401, 'Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.config.jwtSecret, { expiresIn: env_1.config.jwtExpiresIn });
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
exports.signin = signin;

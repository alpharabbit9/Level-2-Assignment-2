"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const AppError_1 = require("../utils/AppError");
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.AppError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};
exports.restrictTo = restrictTo;

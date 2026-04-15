"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
    });
};
exports.sendResponse = sendResponse;

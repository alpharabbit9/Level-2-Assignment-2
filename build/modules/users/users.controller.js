"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const usersService = __importStar(require("./users.service"));
const AppError_1 = require("../../utils/AppError");
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await usersService.getAllUsers();
    (0, response_1.sendResponse)(res, 200, {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
    });
});
exports.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
        throw new AppError_1.AppError(403, 'You can only update your own profile');
    }
    const updatedUser = await usersService.updateUser(userId, req.body);
    (0, response_1.sendResponse)(res, 200, {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
});
exports.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    await usersService.deleteUser(userId);
    (0, response_1.sendResponse)(res, 200, {
        success: true,
        message: 'User deleted successfully',
    });
});

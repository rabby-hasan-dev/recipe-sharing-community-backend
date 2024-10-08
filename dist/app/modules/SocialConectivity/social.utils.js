"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRating = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Helper function to validate the rating input
const validateRating = (rating) => {
    if (rating < 1 || rating > 5) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Rating must be between 1 and 5 stars.');
    }
};
exports.validateRating = validateRating;

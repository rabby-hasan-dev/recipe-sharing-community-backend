"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = require("../modules/User/user.model");
const AppError_1 = __importDefault(require("../errors/AppError"));
const verifyPremium = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const user = yield user_model_1.User.isUserExists(userId);
    if (!user || !user.isPremium) {
        throw new AppError_1.default(403, 'You need a premium subscription to access this content.');
    }
    if (new Date() > new Date(user.premiumExpiresAt)) {
        throw new AppError_1.default(403, 'Your premium subscription has expired.');
    }
    next();
}));
exports.default = verifyPremium;

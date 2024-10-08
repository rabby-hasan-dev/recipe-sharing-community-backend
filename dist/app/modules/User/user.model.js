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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_interface_1 = require("./user.interface");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
});
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: userNameSchema,
    },
    bio: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: user_interface_1.UserRoleEnum,
        default: user_interface_1.UserRoleEnum.USER,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: user_interface_1.UserStatusEnum,
        default: user_interface_1.UserStatusEnum.IN_PROGRESS,
    },
    profilePicture: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    isPremium: {
        type: Boolean,
        default: false, // indicates premium membership
    },
    premiumExpiresAt: {
        type: Date, // expiration date for premium membership
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // doc
        // hashing password and save into DB
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select('+password');
    });
};
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
userSchema.methods.isPremiumActive = function () {
    return this.isPremium && this.premiumExpiresAt > Date.now();
};
exports.User = (0, mongoose_1.model)('User', userSchema);

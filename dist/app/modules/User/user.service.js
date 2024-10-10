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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const constant_1 = require("../../constant");
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("./user.constant");
const getMyProfileIntoDB = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === constant_1.USER_ROLE.user) {
        result = yield user_model_1.User.findOne({ email: email });
    }
    return result;
});
const updateUserDataIntoDB = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email } = user;
    const userExists = user_model_1.User.isUserExists(userId);
    if (!userExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not Authorized');
    }
    if (file === null || file === void 0 ? void 0 : file.path) {
        payload.profilePicture = file.path;
    }
    const { name } = payload, remainingUserData = __rest(payload, ["name"]);
    const modifiedUpdatedData = Object.assign({}, remainingUserData);
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    try {
        const result = yield user_model_1.User.findOneAndUpdate({ email: email }, modifiedUpdatedData, { new: true });
        // return result;
    }
    catch (err) {
        console.error("Update error:", err); // Catch and log any errors
    }
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const getIsPrimiumUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {

    const userExists = user_model_1.User.findById(id);
    if (!userExists) {
        throw new Error("user not found");
    }
    const result = yield user_model_1.User.findOne({ _id: id, isPremium: true });

    return result;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false, status: !user_constant_1.UserStatus.BLOCKED }), query)
        .search(user_constant_1.UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield UserQuery.countTotal();
    const result = yield UserQuery.modelQuery;
    return {
        meta,
        result,
    };
});
exports.UserServices = {
    updateUserDataIntoDB,
    getMyProfileIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    getIsPrimiumUserFromDB
};

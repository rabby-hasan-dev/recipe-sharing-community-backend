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
exports.AdminServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const user_constant_1 = require("../User/user.constant");
const recipe_model_1 = require("../Recipe/recipe.model");
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
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
const blockUserIntoDB = (userId, updateStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.User.isUserExists(userId);
    if (!userExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not Found');
    }
    const blockUser = yield user_model_1.User.findByIdAndUpdate(userId, { status: updateStatus === null || updateStatus === void 0 ? void 0 : updateStatus.status }, { new: true });
    return blockUser;
});
const createAdminIntoDB = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const createAdmin = yield user_model_1.User.findByIdAndUpdate(id, { role: role }, { new: true });
    return createAdmin;
});
const publishRecipeIntoDB = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    const isRecipeExists = yield recipe_model_1.Recipe.isRecipeExists(recipeId);
    if (!isRecipeExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Recipe not found!');
    }
    // If the recipe exists, toggle the isPublished field
    if (isRecipeExists) {
        const publishRecipe = yield recipe_model_1.Recipe.findByIdAndUpdate(recipeId, { isPublished: !isRecipeExists.isPublished }, // Toggle the current value
        { new: true });
        return publishRecipe;
    }
});
const premiumUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const isPrimumUser = yield user_model_1.User.find({ isPremium: true });
    return isPrimumUser;
});
//  Do it After some minuite Better approch
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.User.isUserExists(userId);
    if (!userExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not Found');
    }
    const deletedUser = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
    return deletedUser;
});
exports.AdminServices = {
    createAdminIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    blockUserIntoDB,
    publishRecipeIntoDB,
    premiumUsersFromDB
};

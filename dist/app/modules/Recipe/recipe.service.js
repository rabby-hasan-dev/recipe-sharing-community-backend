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
exports.RecipeServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const recipe_constant_1 = require("./recipe.constant");
const recipe_model_1 = require("./recipe.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const getAllRecipeFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(recipe_model_1.Recipe.find().populate('author'), query)
        .search(recipe_constant_1.recipeSearchableFields)
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
const CreateRecipeIntoDB = (userId, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = new mongoose_1.default.Types.ObjectId(userId);
    const { file } = files;
    const recipeData = Object.assign(Object.assign({}, payload), { author: authorId, images: file.map((image) => image.path) });
    const result = yield recipe_model_1.Recipe.create(recipeData);
    return result;
});
const getSingleRecipeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_model_1.Recipe.findById(id);
    return result;
});
const updateRecipeIntoDB = (id, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = files;
    if (files.length) {
        payload.images = file.map((image) => image.path);
    }
    const result = yield recipe_model_1.Recipe.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteRecipeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isRecipeExists = yield recipe_model_1.Recipe.isRecipeExists(id);
    if (!isRecipeExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Recipe not found!');
    }
    const result = yield recipe_model_1.Recipe.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.RecipeServices = {
    CreateRecipeIntoDB,
    getAllRecipeFromDB,
    getSingleRecipeFromDB,
    updateRecipeIntoDB,
    deleteRecipeFromDB,
};

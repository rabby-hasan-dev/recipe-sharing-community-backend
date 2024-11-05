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
exports.FeedService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const recipe_model_1 = require("../Recipe/recipe.model");
const feed_constant_1 = require("./feed.constant");
const getAllPublicRecipeFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(recipe_model_1.Recipe.find({ isPremium: false, isDeleted: false })
        .populate('author')
        .lean(), query)
        .search(feed_constant_1.recipeSearchableFields)
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
const getAllPrimiumRecipeFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(recipe_model_1.Recipe.find({ isPremium: true, isDeleted: false }).populate('author'), query)
        .search(feed_constant_1.recipeSearchableFields)
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
exports.FeedService = {
    getAllPublicRecipeFromDB,
    getAllPrimiumRecipeFromDB,
};

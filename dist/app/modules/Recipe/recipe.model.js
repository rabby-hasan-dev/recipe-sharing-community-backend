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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const mongoose_1 = require("mongoose");
const RecipeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    images: [
        {
            type: String,
            required: [true, 'Image is required'],
        },
    ],
    ingredients: {
        type: [String], // Array of ingredients
        required: [true, 'Ingredients are required'],
    },
    cookingTime: {
        type: Number, // Cooking time in minutes
        required: [true, 'Cooking time is required'],
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference to User who is the author
        required: [true, 'Author is required'],
    },
    totalRatings: {
        type: Number,
        default: 0, // Auto-calculated average of ratings
    },
    averageRating: {
        type: Number,
        default: 0, // Auto-calculated average of ratings
    },
    upVoteCount: { type: Number, default: 0 },
    downVoteCount: { type: Number, default: 0 },
    totalComment: { type: Number, default: 0 },
    isPremium: {
        type: Boolean,
        default: false, // Indicates if the recipe is premium content
    },
    isPublished: {
        type: Boolean,
        default: false, // Indicates if the recipe is published
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Query Middleware
RecipeSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
RecipeSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
RecipeSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
//creating a custom static method
RecipeSchema.statics.isRecipeExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRecipe = yield exports.Recipe.findById(id);
        return existingRecipe;
    });
};
exports.Recipe = (0, mongoose_1.model)('Recipe', RecipeSchema);

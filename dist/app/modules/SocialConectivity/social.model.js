"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = exports.Comment = exports.Rating = void 0;
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, {
    timestamps: true,
});
const commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const voteSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    value: {
        type: Number,
        required: true,
        enum: [1, -1], // 1 for upvote, -1 for downvote
    },
}, {
    timestamps: true,
});
exports.Rating = (0, mongoose_1.model)('Rating', ratingSchema);
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.Vote = (0, mongoose_1.model)('Vote', voteSchema);

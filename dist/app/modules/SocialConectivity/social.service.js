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
exports.SocailConectivityServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const social_model_1 = require("./social.model");
const recipe_model_1 = require("../Recipe/recipe.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../User/user.model");
const social_utils_1 = require("./social.utils");
// -------------- Rate Recpe section ---------
// Submit or update a rating, then calculate and update the recipe's average rating
const rateAndCalculateAverage = (currentUserId, recipeId, ratingValue) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, social_utils_1.validateRating)(ratingValue);
    const userExists = yield user_model_1.User.isUserExists(currentUserId);
    const recipeExists = yield recipe_model_1.Recipe.isRecipeExists(recipeId);
    if (!userExists || !recipeExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or both recipe and users not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existingRating = yield social_model_1.Rating.findOne({
            recipeId,
            userId: currentUserId,
        });
        if (existingRating) {
            existingRating.rating = ratingValue;
            yield existingRating.save({ session });
        }
        else {
            yield social_model_1.Rating.create([{ recipeId, userId: currentUserId, rating: ratingValue }], { session });
            // await Recipe.findByIdAndUpdate(recipeId, { $push: { ratings: newRating._id } }, { session });
        }
        // Aggregate to update the average rating and total rating count
        const ratingsData = yield social_model_1.Rating.aggregate([
            { $match: { recipeId: new mongoose_1.default.Types.ObjectId(recipeId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ]).session(session);
        const averageRating = ((_a = ratingsData[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0;
        const totalRatings = ((_b = ratingsData[0]) === null || _b === void 0 ? void 0 : _b.totalRatings) || 0;
        yield recipe_model_1.Recipe.findByIdAndUpdate(recipeId, { averageRating, totalRatings }, { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            averageRating,
            totalRatings,
            message: 'Rating submitted successfully!',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to submit rating!');
    }
});
const getRecipeRatingsFromDB = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield social_model_1.Rating.find({ recipeId })
        .populate('userId')
        .populate('recipeId');
    return ratings;
});
// -------------- Comment Recpe section ---------
const postRecipeCommentIntoDB = (currentUserId, recipeId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.User.isUserExists(currentUserId);
    if (!userExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newComment = { recipeId, userId: currentUserId, comment };
        const savedComment = yield social_model_1.Comment.create([newComment], { session });
        // Check if the Recipe exists
        const recipe = yield recipe_model_1.Recipe.findById(recipeId).session(session); // Ensure session is used for the query
        if (!recipe) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Recipe not found!');
        }
        // Update the Recipe with the new comment and increment the commentCount
        yield recipe_model_1.Recipe.findByIdAndUpdate(recipeId, {
            // $push: { comments: savedComment[0]._id },
            $inc: { totalComment: 1 }, // Increment the totalcomment
        }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return savedComment;
        // @ts-nocheck
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to submit comment!');
    }
});
const getRecipeCommentFromDB = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield social_model_1.Comment.find({ recipeId })
        .populate('userId')
        .populate('recipeId')
        .sort({ createdAt: -1 });
});
const editRecipeCommentFromDB = (userId, commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield social_model_1.Comment.findOne({ _id: commentId, userId });
    if (!comment) {
        throw new Error('Comment not found or you are not authorized to edit this comment');
    }
    const updateComment = yield social_model_1.Comment.findByIdAndUpdate(commentId, { comment: content }, { new: true });
    return updateComment;
});
const deleteRecipeCommentFromDB = (recipeId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deleteComment = yield social_model_1.Comment.findByIdAndDelete(commentId, {
            session,
        });
        // Check if the Recipe exists
        const recipe = yield recipe_model_1.Recipe.findById(recipeId).session(session); // Ensure session is used for the query
        if (!recipe) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Recipe not found!');
        }
        yield recipe_model_1.Recipe.findByIdAndUpdate(recipeId, {
            // $pull: { comments: commentId },
            $inc: { totalComment: -1 }, //  decrement total comment count
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return deleteComment;
        // @ts-nocheck
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to submit comment deletion!');
    }
});
// -------------- Vote Recpe section ---------
const toggleVote = (recipeId, userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.User.isUserExists(userId);
    if (!userExists)
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
    const recipe = yield recipe_model_1.Recipe.findById(recipeId);
    if (!recipe)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Recipe not found!');
    // Find or create vote
    let vote = yield social_model_1.Vote.findOne({ user: userId, recipeId });
    if (vote) {
        if ((type === 'upvote' && vote.value === 1) ||
            (type === 'downvote' && vote.value === -1)) {
            // Remove vote (unvote)
            yield social_model_1.Vote.deleteOne({ user: userId, recipeId });
            type === 'upvote' ? recipe.upVoteCount-- : recipe.downVoteCount--;
            yield recipe.save();
            return { message: `${type} removed` };
        }
        else {
            // Switch vote
            vote.value = type === 'upvote' ? 1 : -1;
            yield vote.save();
            recipe[type === 'upvote' ? 'upVoteCount' : 'downVoteCount']++;
            recipe[type === 'downvote' ? 'upVoteCount' : 'downVoteCount']--;
            yield recipe.save();
            return { message: `${type} toggled` };
        }
    }
    else {
        // Create a new vote
        vote = new social_model_1.Vote({
            user: userId,
            recipeId,
            value: type === 'upvote' ? 1 : -1,
        });
        yield vote.save();
        type === 'upvote' ? recipe.upVoteCount++ : recipe.downVoteCount++;
        yield recipe.save();
        return { message: `${type} added` };
    }
});
exports.SocailConectivityServices = {
    rateAndCalculateAverage,
    getRecipeRatingsFromDB,
    postRecipeCommentIntoDB,
    getRecipeCommentFromDB,
    editRecipeCommentFromDB,
    deleteRecipeCommentFromDB,
    toggleVote,
};

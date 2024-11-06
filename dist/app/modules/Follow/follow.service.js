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
exports.followServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const follow_model_1 = require("./follow.model");
const user_model_1 = require("../User/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const followUserIntoDB = (currentUserId, userToFollowId) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUserId === userToFollowId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot follow yourself');
    }
    const currentUserExists = yield user_model_1.User.isUserExists(currentUserId);
    const userToFollowExists = yield user_model_1.User.isUserExists(currentUserId);
    if (!currentUserExists || !userToFollowExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or both users not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Use $addToSet to ensure no duplicates are added
        yield follow_model_1.Following.updateOne({ user: currentUserId }, { $addToSet: { following: userToFollowId } }, { upsert: true, session });
        yield follow_model_1.Follower.updateOne({ user: userToFollowId }, { $addToSet: { followers: currentUserId } }, { upsert: true, session });
        // Update the followersCount and followingCount in the User collection
        yield user_model_1.User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } }, { session });
        yield user_model_1.User.findByIdAndUpdate(userToFollowId, { $inc: { followerCount: 1 } }, { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: 'User followed successfully',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to follow user');
    }
});
const UnfollowUserIntoDB = (currentUserId, userToUnfollowId) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUserId === userToUnfollowId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot Unfollow yourself');
    }
    const currentUserExists = yield user_model_1.User.isUserExists(currentUserId);
    const userToFollowExists = yield user_model_1.User.isUserExists(currentUserId);
    if (!currentUserExists || !userToFollowExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or both users not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Use $pull to remove the user from the following/follower lists
        yield follow_model_1.Following.updateOne({ user: currentUserId }, { $pull: { following: userToUnfollowId } }, { upsert: true, session });
        yield follow_model_1.Follower.updateOne({ user: userToUnfollowId }, { $pull: { followers: currentUserId } }, { upsert: true, session });
        // Decrement the followersCount and followingCount in the User collection
        yield user_model_1.User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } }, { session });
        yield user_model_1.User.findByIdAndUpdate(userToUnfollowId, { $inc: { followerCount: -1 } }, { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: 'User unfollowed successfully',
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to Unfollow user');
    }
});
exports.followServices = {
    followUserIntoDB,
    UnfollowUserIntoDB,
};

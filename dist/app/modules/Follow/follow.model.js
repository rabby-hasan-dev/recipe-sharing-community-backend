"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Following = exports.Follower = void 0;
const mongoose_1 = require("mongoose");
const followerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});
followerSchema.index({ user: 1 }); // Index for quick lookup
const followingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});
followingSchema.index({ user: 1 }); // Index for quick lookup
exports.Follower = (0, mongoose_1.model)('Follower', followerSchema);
exports.Following = (0, mongoose_1.model)('Following', followingSchema);

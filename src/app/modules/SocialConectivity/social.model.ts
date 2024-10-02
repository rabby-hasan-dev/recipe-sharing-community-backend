import { model, Schema } from "mongoose";
import { IComment, IRating, IVote } from "./social.interface";


const ratingSchema = new Schema<IRating>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

}, {
    timestamps: true
}
);

const commentSchema = new Schema<IComment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },

}, {
    timestamps: true
}
);


const voteSchema = new Schema<IVote>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    value: {
        type: Number,
        required: true,
        enum: [1, -1], // 1 for upvote, -1 for downvote
    },
}, {
    timestamps: true
});


export const Rating = model<IRating>('Rating', ratingSchema);
export const Comment = model<IComment>('Comment', commentSchema);
export const Vote = model<IVote>('Vote', voteSchema);


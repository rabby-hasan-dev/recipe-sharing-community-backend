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
    upVote: {
        type: Number,
        default: 0,
        required: true
    },
    downVote: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true
});


export const Rating = model<IRating>('Rating', ratingSchema);
export const Comment = model<IComment>('Comment', commentSchema);
export const Vote = model<IVote>('Vote', voteSchema);


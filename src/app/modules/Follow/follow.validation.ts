import { Types } from "mongoose";
import { z } from "zod";




export const FollowerSchema = z.object({
    user: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid user ID format",
    }),
    followers: z.array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid follower ID format",
        })
    ),
});

export const FollowingSchema = z.object({
    user: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid user ID format",
    }),
    following: z.array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid follower ID format",
        })
    ),
});

export const followValidation = {
    FollowerSchema,
    FollowingSchema
}
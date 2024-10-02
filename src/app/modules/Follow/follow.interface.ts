import { Types } from "mongoose";


export interface IFollower {
    user: Types.ObjectId;
    followers: Types.ObjectId[];

}
export interface IFollowing {
    user: Types.ObjectId;
    following: Types.ObjectId[];

}
import { Types } from 'mongoose';

export interface IRating {
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  rating: number;
}

export interface IComment {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  comment: string;
}

export interface IVote {
  user: Types.ObjectId;
  recipeId: Types.ObjectId;
  value: number;
}

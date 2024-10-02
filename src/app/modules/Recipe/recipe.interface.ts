import { Model, Schema } from "mongoose";

export interface IRecipe {
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingTime: number;
  author: Schema.Types.ObjectId;
  ratings: {
    user: Schema.Types.ObjectId;
    rating: number;
  }[];
  averageRating: number;
  upVoteCount: number;
  downVoteCount: number;
  // upvotes: Schema.Types.ObjectId[];
  // downvotes: Schema.Types.ObjectId[];
  comments: {
    user: Schema.Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];
  isPremium: boolean;
  isPublished: boolean;
  isDeleted: boolean;
}






export interface RecipeModel extends Model<IRecipe> {

  isRecipeExists(id: string): Promise<IRecipe | null>;
}

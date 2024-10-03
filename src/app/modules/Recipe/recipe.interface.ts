import { Model, Types } from 'mongoose';

export interface IRecipe {
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingTime: number;
  author: Types.ObjectId;
  totalRatings: number;
  averageRating: number;
  upVoteCount: number;
  downVoteCount: number;
  totalComment: number;
  isPremium: boolean;
  isPublished: boolean;
  isDeleted: boolean;
}

export interface RecipeModel extends Model<IRecipe> {
  isRecipeExists(id: string): Promise<IRecipe | null>;
}

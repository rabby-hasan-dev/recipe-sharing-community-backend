import { Schema, model } from 'mongoose';
import { IRecipe, RecipeModel } from './recipe.interface';


const RecipeSchema = new Schema<IRecipe, RecipeModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    ingredients: {
      type: [String], // Array of ingredients
      required: [true, 'Ingredients are required'],
    },
    cookingTime: {
      type: Number, // Cooking time in minutes
      required: [true, 'Cooking time is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User who is the author
      required: [true, 'Author is required'],
    },
    totalRatings: {
      type: Number,
      default: 0, // Auto-calculated average of ratings
    },
    averageRating: {
      type: Number,
      default: 0, // Auto-calculated average of ratings
    },

    upVoteCount: { type: Number, default: 0 },
    downVoteCount: { type: Number, default: 0 },
    totalComment: { type: Number, default: 0 },
    isPremium: {
      type: Boolean,
      default: false, // Indicates if the recipe is premium content
    },
    isPublished: {
      type: Boolean,
      default: false, // Indicates if the recipe is published
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);






// Query Middleware
RecipeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

RecipeSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

RecipeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//creating a custom static method
RecipeSchema.statics.isRecipeExists = async function (id: string) {
  const existingRecipe = await Recipe.findById(id);
  return existingRecipe;
};

export const Recipe = model<IRecipe, RecipeModel>('Recipe', RecipeSchema);
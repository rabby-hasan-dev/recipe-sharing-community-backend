import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { IRecipe } from './recipe.interface';
import { Recipe } from './recipe.model';
import { TImageFile } from '../../interface/image.interface';

const getAllRecipeFromDB = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(Recipe.find(), query)
    .search(recipeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await UserQuery.countTotal();
  const result = await UserQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const CreateRecipeIntoDB = async (
  userId: string,
  payload: IRecipe,
  file: TImageFile,
) => {
  const authorId = new mongoose.Types.ObjectId(userId);
  const recipeData: IRecipe = {
    ...payload,
    author: authorId,
    image: file?.path,
  };
  const result = await Recipe.create(recipeData);
  return result;
};

const getSingleRecipeFromDB = async (id: string) => {
  const result = await Recipe.findById(id);
  return result;
};

const updateRecipeIntoDB = async (
  id: string,
  payload: Partial<IRecipe>,
  file: TImageFile,
) => {
  if (file?.path) {
    payload.image = file.path;
  }

  const result = await Recipe.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteRecipeFromDB = async (id: string) => {
  const result = await Recipe.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const RecipeServices = {
  CreateRecipeIntoDB,
  getAllRecipeFromDB,
  getSingleRecipeFromDB,
  updateRecipeIntoDB,
  deleteRecipeFromDB,
};

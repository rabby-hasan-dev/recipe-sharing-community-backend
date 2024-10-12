import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { IRecipe } from './recipe.interface';
import { Recipe } from './recipe.model';
import { TImageFiles } from '../../interface/image.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getAllRecipeFromDB = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(Recipe.find().populate('author'), query)
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
  files: TImageFiles,
) => {

  const authorId = new mongoose.Types.ObjectId(userId);
  const { file } = files;
  const recipeData: IRecipe = {
    ...payload,
    author: authorId,
    images: file.map((image) => image.path),
  };

  const result = await Recipe.create(recipeData);

  return result;
};


const getSingleRecipeFromDB = async (id: string) => {

  const result = await Recipe.findById(id);
  return result;
};

const getAllRecipeByAuthorFromDB = async (id: string) => {
  const result = await Recipe.find({ author: id, isDeleted: false }).populate('author');
  return result;
};

const updateRecipeIntoDB = async (
  id: string,
  payload: Partial<IRecipe>,
  files: TImageFiles,
) => {
  const { file } = files;
  if (files.length) {
    payload.images = file.map((image) => image.path);
  }

  const result = await Recipe.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteRecipeFromDB = async (id: string) => {

  const isRecipeExists = await Recipe.isRecipeExists(id)
  if (!isRecipeExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found!')
  }
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
  getAllRecipeByAuthorFromDB
};

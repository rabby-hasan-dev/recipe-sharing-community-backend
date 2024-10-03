import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecipeServices } from './recipe.service';


const createRecipe = catchAsync(async (req, res) => {
  const recipe = req.body;
  const userId = req?.user?.userId;
  const result = await RecipeServices.CreateRecipeIntoDB(userId, recipe);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe Create succesfully',
    data: result,
  });
});
const getSingleRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await RecipeServices.getSingleRecipeFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe is retrieved succesfully',
    data: result,
  });
});

const getAllRecipes: RequestHandler = catchAsync(async (req, res) => {
  const result = await RecipeServices.getAllRecipeFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const recipeData = req.body;
  const result = await RecipeServices.updateRecipeIntoDB(recipeId, recipeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe is updated succesfully',
    data: result,
  });
});

const deleteRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await RecipeServices.deleteRecipeFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe is deleted succesfully',
    data: result,
  });
});

export const RecipeControllers = {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  deleteRecipe,
  updateRecipe,
};

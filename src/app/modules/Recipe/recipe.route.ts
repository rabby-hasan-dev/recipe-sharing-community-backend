import express, { NextFunction, Request, Response } from 'express';

import { RecipeControllers } from './recipe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidator } from './recipe.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import { multerUpload } from '../../config/multer.config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { parseBody } from '../../middlewares/bodyparser';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  // multerUpload.single('file'),
  multerUpload.fields([{ name: 'file' }]),

  parseBody,
  validateRequest(recipeValidator.RecipeValidationSchema),
  RecipeControllers.createRecipe,
);
router.get('/', RecipeControllers.getAllRecipes);
router.get(
  '/:recipeId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  RecipeControllers.getSingleRecipe,
);

router.put(
  '/:recipeId',
  auth(USER_ROLE.user),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(recipeValidator.UpdatedRecipeValidationSchema),
  RecipeControllers.updateRecipe,
);
router.delete(
  '/:recipeId',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin),
  RecipeControllers.deleteRecipe,
);

export const RecipeRoutes = router;

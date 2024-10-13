import express from 'express';
import { RecipeControllers } from './recipe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidator } from './recipe.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyparser';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.fields([{ name: 'file' }]),
  parseBody,
  // validateRequest(recipeValidator.RecipeValidationSchema),
  RecipeControllers.createRecipe,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin),
  RecipeControllers.getAllRecipes,
);

router.get(
  '/:recipeId',

  RecipeControllers.getSingleRecipe,
);

router.get(
  '/author/:userId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  RecipeControllers.getAllRecipesByAuthor,
);

router.put(
  '/:recipeId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.fields([{ name: 'file' }]),
  parseBody,
  validateRequest(recipeValidator.UpdatedRecipeValidationSchema),
  RecipeControllers.updateRecipe,
);
router.delete(
  '/:recipeId',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin),
  RecipeControllers.deleteRecipe,
);

export const RecipeRoutes = router;

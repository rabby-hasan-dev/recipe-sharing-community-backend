import express from 'express';


import { RecipeControllers } from './recipe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidator } from './recipe.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';



const router = express.Router();

router.post('/', auth(USER_ROLE.user), validateRequest(recipeValidator.RecipeValidationSchema), RecipeControllers.createRecipe);
router.get('/', RecipeControllers.getAllRecipes);
router.get('/:recipeId', RecipeControllers.getSingleRecipe);

router.put('/:recipeId', RecipeControllers.updateRecipe,
);
router.delete('/:recipeId', RecipeControllers.deleteRecipe);

export const RecipeRoutes = router;

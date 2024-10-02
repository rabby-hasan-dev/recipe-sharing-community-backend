import express from 'express';


import { RecipeControllers } from './recipe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidator } from './recipe.validation';



const router = express.Router();

router.post('/', validateRequest(recipeValidator.RecipeValidationSchema), RecipeControllers.createRecipe);
router.get('/', RecipeControllers.getAllRecipes);
router.get('/:recipeId', RecipeControllers.getSingleRecipe);

router.put('/:recipeId', RecipeControllers.updateRecipe,
);
router.delete('/:recipeId', RecipeControllers.deleteRecipe);

export const RecipeRoutes = router;

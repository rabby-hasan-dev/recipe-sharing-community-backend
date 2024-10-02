import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import { SocailConectivityControllers } from './social.controller';

const router = express.Router();



router.post('/:recipeId/rate', auth(USER_ROLE.user), SocailConectivityControllers.rateRecipe);
router.get('/:recipeId/ratings',
    auth(USER_ROLE.user),
    SocailConectivityControllers.getRecipeRatings);
router.get('/:recipeId/rating/average', SocailConectivityControllers.getAvarageRecipeRatings);
router.post('/:recipeId/comments', auth(USER_ROLE.user), SocailConectivityControllers.postRecipeComment);
router.get('/:recipeId/comments', SocailConectivityControllers.getRecipeComment);
router.put('/:recipeId/comments/:commentId',
    auth(USER_ROLE.user),
    SocailConectivityControllers.editeRecipeComment);
router.delete('/:recipeId/comments/:commentId', auth(USER_ROLE.user), SocailConectivityControllers.deleteRecipeComment);
router.put('/:recipeId/upvote', auth(USER_ROLE.user), SocailConectivityControllers.upvoteRecipe);
router.put('/:recipeId/downvote', auth(USER_ROLE.user), SocailConectivityControllers.downvoteRecipe);
router.get('/:recipeId/votes', SocailConectivityControllers.getvotes);

export const SocailConectivityRoutes = router;

import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import { SocailConectivityControllers } from './social.controller';

const router = express.Router();

router.post(
  '/:recipeId/rate',
  auth(USER_ROLE.user),
  SocailConectivityControllers.rateRecipe,
);
router.get(
  '/:recipeId/ratings',
  auth(USER_ROLE.user),
  SocailConectivityControllers.getRecipeRatings,
);
router.post(
  '/:recipeId/comments',
  auth(USER_ROLE.user),
  SocailConectivityControllers.postRecipeComment,
);
router.get(
  '/:recipeId/comments',
  SocailConectivityControllers.getRecipeComment,
);
router.put(
  '/comments/:commentId',
  auth(USER_ROLE.user),
  SocailConectivityControllers.editeRecipeComment,
);
router.delete(
  '/:recipeId/comments/:commentId',
  auth(USER_ROLE.user),
  SocailConectivityControllers.deleteRecipeComment,
);
router.put(
  '/:recipeId/votes',
  auth(USER_ROLE.user),
  SocailConectivityControllers.toggleVoteRecipe,
);

export const SocailConectivityRoutes = router;

import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import { SocailConectivityControllers } from './social.controller';

const router = express.Router();

router.post(
  '/:recipeId/rating',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.rateRecipe,
);
router.get(
  '/:recipeId/ratings',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.getRecipeRatings,
);
router.post(
  '/:recipeId/comments',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.postRecipeComment,
);
router.get(
  '/:recipeId/comments',
  SocailConectivityControllers.getRecipeComment,
);
router.put(
  '/comments/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.editeRecipeComment,
);
router.delete(
  '/:recipeId/comments/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.deleteRecipeComment,
);
router.put(
  '/:recipeId/votes',
  auth(USER_ROLE.user, USER_ROLE.admin),
  SocailConectivityControllers.toggleVoteRecipe,
);

export const SocailConectivityRoutes = router;

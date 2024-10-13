import express from 'express';
import { FeedController } from './feed.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import verifyPremium from '../../middlewares/primium';

const router = express.Router();

router.get('/', FeedController.getAllPublicRecipes);

router.get(
  '/premium',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  verifyPremium,
  FeedController.getAllPrimiumRecipes,
);

export const FeedRoutes = router;

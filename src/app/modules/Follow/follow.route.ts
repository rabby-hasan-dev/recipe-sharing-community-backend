import express from 'express';
import { followController } from './follow.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';

const router = express.Router();

router.post(
  '/follow/:userId',
  auth(USER_ROLE.user),
  followController.followUser,
);
router.post(
  '/unfollow/:userId',
  auth(USER_ROLE.user),
  followController.unfollowUser,
);

export const FollowRoutes = router;

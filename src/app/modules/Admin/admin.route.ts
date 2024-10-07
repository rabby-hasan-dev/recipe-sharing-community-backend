import express from 'express';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.get(
  '/users',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getAllUsers,
);
router.put(
  '/users/:userId/block',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AdminValidation.changeStatusValidationSchema),
  AdminControllers.blockUser,
);

router.delete(
  '/users/:userId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.deleteUser,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.createAdmin,
);

router.put(
  '/recipes/publish',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.publishRecipe,
);
router.get(
  '/premium-users',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getPremiumUsers,
);

export const AdminRoutes = router;

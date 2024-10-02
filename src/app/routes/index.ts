import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UsersRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { FollowRoutes } from '../modules/Follow/follow.route';
import { PremiumRoutes } from '../modules/Premium/premium.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { RecipeRoutes } from '../modules/Recipe/recipe.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UsersRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/follow',
    route: FollowRoutes,
  },
  {
    path: '/membership',
    route: PremiumRoutes,
  },
  {
    path: '/payments',
    route: paymentRoutes,
  },
  {
    path: '/recipes',
    route: RecipeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

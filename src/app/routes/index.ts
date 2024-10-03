import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UsersRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { FollowRoutes } from '../modules/Follow/follow.route';
import { PremiumRoutes } from '../modules/PremiumMemberShipSubscription/premium.route';
import { RecipeRoutes } from '../modules/Recipe/recipe.route';
import { SocailConectivityRoutes } from '../modules/SocialConectivity/social.route';

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
    path: '/premium-membership',
    route: PremiumRoutes,
  },
  {
    path: '/recipes',
    route: RecipeRoutes,
  },
  {
    path: '/social-conectivity',
    route: SocailConectivityRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

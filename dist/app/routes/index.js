"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const follow_route_1 = require("../modules/Follow/follow.route");
const premium_route_1 = require("../modules/PremiumMemberShipSubscription/premium.route");
const recipe_route_1 = require("../modules/Recipe/recipe.route");
const social_route_1 = require("../modules/SocialConectivity/social.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UsersRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/follow',
        route: follow_route_1.FollowRoutes,
    },
    {
        path: '/premium-membership',
        route: premium_route_1.PremiumRoutes,
    },
    {
        path: '/recipes',
        route: recipe_route_1.RecipeRoutes,
    },
    {
        path: '/social-conectivity',
        route: social_route_1.SocailConectivityRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

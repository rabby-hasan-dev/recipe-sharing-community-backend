"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocailConectivityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../constant");
const social_controller_1 = require("./social.controller");
const router = express_1.default.Router();
router.post('/:recipeId/rating', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.rateRecipe);
router.get('/:recipeId/ratings', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.getRecipeRatings);
router.post('/:recipeId/comments', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.postRecipeComment);
router.get('/:recipeId/comments', social_controller_1.SocailConectivityControllers.getRecipeComment);
router.put('/comments/:commentId', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.editeRecipeComment);
router.delete('/:recipeId/comments/:commentId', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.deleteRecipeComment);
router.put('/:recipeId/votes', (0, auth_1.default)(constant_1.USER_ROLE.user), social_controller_1.SocailConectivityControllers.toggleVoteRecipe);
exports.SocailConectivityRoutes = router;

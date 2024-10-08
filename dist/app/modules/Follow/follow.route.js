"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const follow_controller_1 = require("./follow.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../constant");
const router = express_1.default.Router();
router.post('/follow/:userId', (0, auth_1.default)(constant_1.USER_ROLE.user), follow_controller_1.followController.followUser);
router.post('/unfollow/:userId', (0, auth_1.default)(constant_1.USER_ROLE.user), follow_controller_1.followController.unfollowUser);
exports.FollowRoutes = router;

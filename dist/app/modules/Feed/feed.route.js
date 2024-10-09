"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedRoutes = void 0;
const express_1 = __importDefault(require("express"));
const feed_controller_1 = require("./feed.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../constant");
const primium_1 = __importDefault(require("../../middlewares/primium"));
const router = express_1.default.Router();
router.get('/', feed_controller_1.FeedController.getAllPublicRecipes);
router.get('/premium', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), primium_1.default, feed_controller_1.FeedController.getAllPrimiumRecipes);
exports.FeedRoutes = router;

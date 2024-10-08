"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.get('/users', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), admin_controller_1.AdminControllers.getAllUsers);
router.put('/users/:userId/block', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(admin_validation_1.AdminValidation.changeStatusValidationSchema), admin_controller_1.AdminControllers.blockUser);
router.delete('/users/:userId', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), admin_controller_1.AdminControllers.deleteUser);
router.post('/create-admin', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), admin_controller_1.AdminControllers.createAdmin);
router.put('/recipes/publish', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), admin_controller_1.AdminControllers.publishRecipe);
router.get('/premium-users', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), admin_controller_1.AdminControllers.getPremiumUsers);
exports.AdminRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin), user_controller_1.UserControllers.getMyProfile);
router.put('/me', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.userUpdateValidationSchema), user_controller_1.UserControllers.UpdateMyProfile);
router.get('/:userId', user_controller_1.UserControllers.getSingleUser);
router.get('/', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.getAllUsers);
router.get('/is-primium/userId', user_controller_1.UserControllers.isPremium);
exports.UsersRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumRoutes = void 0;
const express_1 = __importDefault(require("express"));
const constant_1 = require("../../constant");
const premium_controller_1 = require("./premium.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Route to purchase a new subscription
router.post('/purchase', (0, auth_1.default)(constant_1.USER_ROLE.user), premium_controller_1.subscriptionController.purchaseSubscription);
// Route to confirm payment
router.post('/confirm', premium_controller_1.subscriptionController.confirmPayment);
// Route to check if the user has an active subscription
router.get('/active', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), premium_controller_1.subscriptionController.checkActiveSubscription);
router.get('/subscriber', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), premium_controller_1.subscriptionController.getAllSubscriberMember);
exports.PremiumRoutes = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const premium_service_1 = require("./premium.service");
const purchaseSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseData = req.body;
    const currentUserId = req.user.userId;
    console.log(req.body);
    const result = yield premium_service_1.subscriptionService.createSubscriptionIntoDB(currentUserId, purchaseData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
}));
const confirmPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, status } = req.query;
    const result = yield premium_service_1.subscriptionService.paymentConfirmationService(transactionId, status);
    res.send(result);
}));
const checkActiveSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.userId;
    const result = yield premium_service_1.subscriptionService.isSubscriptionActive(currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get subscription status check succesfully',
        data: result,
    });
}));
const getAllSubscriberMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield premium_service_1.subscriptionService.getSubscriberMemberIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get all subscription Member succesfully',
        data: result,
    });
}));
exports.subscriptionController = {
    confirmPayment,
    purchaseSubscription,
    checkActiveSubscription,
    getAllSubscriberMember,
};

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
exports.subscriptionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const premium_model_1 = require("./premium.model");
const moment_1 = __importDefault(require("moment"));
const premium_utils_1 = require("./premium.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const createSubscriptionIntoDB = (currentUserId_1, _a) => __awaiter(void 0, [currentUserId_1, _a], void 0, function* (currentUserId, { membershipType, price }) {
    var _b, _c;
    const currentUser = yield user_model_1.User.isUserExists(currentUserId);
    if (!currentUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, ' Current  users not found');
    }
    // Validate membership type
    if (!['monthly', 'yearly'].includes(membershipType)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid membership type');
    }
    // Set subscription details
    const durationInDays = membershipType === 'monthly' ? 30 : 365;
    const startDate = new Date();
    const endDate = (0, moment_1.default)(startDate).add(durationInDays, 'days').toDate();
    const transactionId = `TXN-${Date.now()}`;
    // Create subscription
    yield premium_model_1.Subscription.create({
        userId: currentUserId,
        membershipType,
        status: 'pending',
        price,
        startDate,
        endDate,
        paymentDetails: {
            transactionId,
            paymentMethod: 'AAMARPAY',
        },
    });
    // Prepare payment data
    const paymentData = {
        transactionId,
        customerName: `${(_b = currentUser.name) === null || _b === void 0 ? void 0 : _b.firstName}  ${(_c = currentUser.name) === null || _c === void 0 ? void 0 : _c.lastName}`,
        customerEmail: currentUser.email,
        customerAddress: currentUser.address || 'default address',
        customerPhone: currentUser.phone || '01245966355',
        totalPrice: price,
    };
    //user data get for payment info
    const paymentSession = yield (0, premium_utils_1.initialPayment)(paymentData);
    return paymentSession;
});
const paymentConfirmationService = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, premium_utils_1.verifyPayment)(transactionId);
    if (!verifyResponse || verifyResponse.pay_status !== 'Successful') {
        return yield (0, premium_utils_1.renderPaymentFailureTemplate)(); // Handle failure case early
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // update subcription payment  status
        yield premium_model_1.Subscription.findOneAndUpdate({ "paymentDetails.transactionId": transactionId }, { status: 'active' }, { new: true, session });
        //  Expiration date retirive from sunscription
        const expirationDate = yield premium_model_1.Subscription.findOne({
            "paymentDetails.transactionId": transactionId
        });
        // update user memberShip confirm  status
        yield user_model_1.User.findOneAndUpdate({ email: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.cus_email }, { isPremium: true, membershipExpiration: expirationDate === null || expirationDate === void 0 ? void 0 : expirationDate.endDate }, { new: true, session });
        yield session.commitTransaction();
        //  extract payment  info
        const extractPaymentData = {
            consumerName: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.cus_name,
            email: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.cus_email,
            phone: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.cus_phone,
            transactionId: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.mer_txnid,
            amount: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.amount,
            currency: 'BDT',
            payment_type: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.payment_type,
            payTime: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.date,
            paymentStatus: verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.pay_status,
        };
        // Render template based on the passed `status`
        if (extractPaymentData && status === 'success') {
            return yield (0, premium_utils_1.renderPaymentSuccessTemplate)(extractPaymentData);
        }
        else if (status === 'fail') {
            return yield (0, premium_utils_1.renderPaymentFailureTemplate)();
        }
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof Error) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Payment confirmation failed: ${error.message}`);
        }
        else {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Payment confirmation failed due to an unknown error.');
        }
    }
    finally {
        yield session.endSession();
    }
});
// Check if the user's subscription is active
const isSubscriptionActive = (currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield premium_model_1.Subscription.findOne({
        currentUserId,
        status: 'active',
    });
    if (!subscription)
        return false;
    return (0, moment_1.default)(subscription.endDate).isAfter(new Date());
});
// Check if the user's subscription is active
const getSubscriberMemberIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield premium_model_1.Subscription.find({});
    return subscription;
});
exports.subscriptionService = {
    createSubscriptionIntoDB,
    paymentConfirmationService,
    isSubscriptionActive,
    getSubscriberMemberIntoDB
};

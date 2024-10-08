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
exports.SocailConectivityControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const social_service_1 = require("./social.service");
// -------------- Rate Recpe section ---------
const rateRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { rating } = req.body;
    const { recipeId } = req.params;
    const result = yield social_service_1.SocailConectivityServices.rateAndCalculateAverage(currentUserId, recipeId, rating);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'rate recipe succesfully',
        data: result,
    });
}));
const getRecipeRatings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipeId } = req.params;
    const result = yield social_service_1.SocailConectivityServices.getRecipeRatingsFromDB(recipeId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'get recipe ratting succesfully',
        data: result,
    });
}));
// -------------- Comment Recpe section ---------
const postRecipeComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { comment } = req.body;
    const { recipeId } = req.params;
    const result = yield social_service_1.SocailConectivityServices.postRecipeCommentIntoDB(currentUserId, recipeId, comment);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post Recipe comment succesfully',
        data: result,
    });
}));
const getRecipeComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipeId } = req.params;
    const result = yield social_service_1.SocailConectivityServices.getRecipeCommentFromDB(recipeId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get Recipe commentg succesfully',
        data: result,
    });
}));
const editeRecipeComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { commentId } = req.params;
    const { comment } = req.body;
    const result = yield social_service_1.SocailConectivityServices.editRecipeCommentFromDB(userId, commentId, comment);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Edit Recipe comment succesfully',
        data: result,
    });
}));
const deleteRecipeComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipeId, commentId } = req.params;
    const result = yield social_service_1.SocailConectivityServices.deleteRecipeCommentFromDB(recipeId, commentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Delete Recipe comment succesfully',
        data: result,
    });
}));
// -------------- Vote Recpe section ---------
const toggleVoteRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { recipeId } = req.params;
    const currentUserId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const voteType = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.type;
    const result = yield social_service_1.SocailConectivityServices.toggleVote(recipeId, currentUserId, voteType);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vote Recipe succesfully',
        data: result,
    });
}));
exports.SocailConectivityControllers = {
    rateRecipe,
    getRecipeRatings,
    postRecipeComment,
    getRecipeComment,
    editeRecipeComment,
    deleteRecipeComment,
    toggleVoteRecipe,
};

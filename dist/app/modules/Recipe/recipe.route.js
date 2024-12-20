"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const recipe_controller_1 = require("./recipe.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const recipe_validation_1 = require("./recipe.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../constant");
const multer_config_1 = require("../../config/multer.config");
const bodyparser_1 = require("../../middlewares/bodyparser");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin), multer_config_1.multerUpload.fields([{ name: 'file' }]), bodyparser_1.parseBody, 
// validateRequest(recipeValidator.RecipeValidationSchema),
recipe_controller_1.RecipeControllers.createRecipe);
router.get('/', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.user, constant_1.USER_ROLE.superAdmin), recipe_controller_1.RecipeControllers.getAllRecipes);
router.get('/:recipeId', recipe_controller_1.RecipeControllers.getSingleRecipe);
router.get('/author/:userId', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.user), recipe_controller_1.RecipeControllers.getAllRecipesByAuthor);
router.put('/:recipeId', (0, auth_1.default)(constant_1.USER_ROLE.user, constant_1.USER_ROLE.admin), multer_config_1.multerUpload.fields([{ name: 'file' }]), bodyparser_1.parseBody, (0, validateRequest_1.default)(recipe_validation_1.recipeValidator.UpdatedRecipeValidationSchema), recipe_controller_1.RecipeControllers.updateRecipe);
router.delete('/:recipeId', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.user, constant_1.USER_ROLE.superAdmin), recipe_controller_1.RecipeControllers.deleteRecipe);
exports.RecipeRoutes = router;

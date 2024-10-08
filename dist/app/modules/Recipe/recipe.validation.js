"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeValidator = void 0;
const zod_1 = require("zod");
const RecipeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim(),
        description: zod_1.z.string().trim(),
        ingredients: zod_1.z.array(zod_1.z.string()).nonempty('Ingredients are required'),
        cookingTime: zod_1.z
            .number()
            .positive('Cooking time must be a positive number')
            .min(1, 'Cooking time is required'),
    }),
});
const UpdatedRecipeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().optional(),
        description: zod_1.z.string().trim().optional(),
        ingredients: zod_1.z
            .array(zod_1.z.string())
            .nonempty('Ingredients are required')
            .optional(),
        cookingTime: zod_1.z
            .number()
            .positive('Cooking time must be a positive number')
            .min(1, 'Cooking time is required')
            .optional(),
    }),
});
exports.recipeValidator = {
    RecipeValidationSchema,
    UpdatedRecipeValidationSchema,
};

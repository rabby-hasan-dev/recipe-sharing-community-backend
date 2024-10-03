import { z } from 'zod';

const RecipeValidationSchema = z.object({
  body: z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    ingredients: z.array(z.string()).nonempty('Ingredients are required'),
    cookingTime: z
      .number()
      .positive('Cooking time must be a positive number')
      .min(1, 'Cooking time is required'),
  }),
});

const UpdatedRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    ingredients: z
      .array(z.string())
      .nonempty('Ingredients are required')
      .optional(),
    cookingTime: z
      .number()
      .positive('Cooking time must be a positive number')
      .min(1, 'Cooking time is required')
      .optional(),
  }),
});

export const recipeValidator = {
  RecipeValidationSchema,
  UpdatedRecipeValidationSchema,
};

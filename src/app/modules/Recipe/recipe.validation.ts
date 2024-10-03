import { z } from 'zod';

const RecipeValidationSchema = z.object({

  body: z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    image: z.string().url({ message: 'Must  be input valid url link' }),
    ingredients: z.array(z.string()).nonempty("Ingredients are required"),
    cookingTime: z.number().positive("Cooking time must be a positive number").min(1, "Cooking time is required")
  })
});


const UpdatedRecipeValidationSchema = z.object({

  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: z.string().url({ message: 'Must  be input valid url link' }).optional(),
    ingredients: z.array(z.string()).nonempty("Ingredients are required").optional(),
    cookingTime: z.number().positive("Cooking time must be a positive number").min(1, "Cooking time is required").optional(),
  })
});

export const recipeValidator = {
  RecipeValidationSchema,
  UpdatedRecipeValidationSchema
}

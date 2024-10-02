import { z } from 'zod';

const RecipeValidationSchema = z.object({

  body: z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    image: z.string().url({ message: 'Must  be input valid url link' }),
    ingredients: z.array(z.string()).nonempty("Ingredients are required"),
    cookingTime: z.number().positive("Cooking time must be a positive number").min(1, "Cooking time is required"),
    author: z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for author"),
    ratings: z.array(
      z.object({
        user: z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for user"),
        rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
      })
    ).optional(),
    averageRating: z.number().default(0),
    upvotes: z.array(
      z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for upvotes")
    ).optional(),
    downvotes: z.array(
      z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for downvotes")
    ).optional(),
    comments: z.array(z.object({})).optional(),
    isPremium: z.boolean().default(false),
    isPublished: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
  })
});


const UpdatedRecipeValidationSchema = z.object({

  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: z.string().url({ message: 'Must  be input valid url link' }).optional(),
    ingredients: z.array(z.string()).nonempty("Ingredients are required").optional(),
    cookingTime: z.number().positive("Cooking time must be a positive number").min(1, "Cooking time is required").optional(),
    author: z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for author").optional(),
    ratings: z.array(
      z.object({
        user: z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for user").optional(),
        rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").optional(),
      })
    ).optional(),
    averageRating: z.number().default(0).optional(),
    upvotes: z.array(
      z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for upvotes")
    ).optional(),
    downvotes: z.array(
      z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for downvotes")
    ).optional(),
    comments: z.array(z.object({})).optional(),
    isPremium: z.boolean().default(false).optional(),
    isPublished: z.boolean().default(false).optional(),
    isDeleted: z.boolean().default(false).optional(),
  })
});

export const recipeValidator = {
  RecipeValidationSchema,
  UpdatedRecipeValidationSchema
}

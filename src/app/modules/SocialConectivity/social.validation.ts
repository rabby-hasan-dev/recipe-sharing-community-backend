import { z } from "zod";



const commentValidator = z.object({
    user: z.string().refine((value) => value.match(/^[a-f\d]{24}$/i), "Invalid ObjectId format for user"),
    comment: z.string(),
    createdAt: z.date().default((() => new Date())),
})
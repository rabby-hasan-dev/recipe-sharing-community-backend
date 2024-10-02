import { z } from 'zod';



const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'active', 'blocked'] as [string, ...string[]]),
  }),
});

export const AdminValidation = {
  changeStatusValidationSchema,
};

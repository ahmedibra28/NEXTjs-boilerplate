import * as z from 'zod'

export const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'name must be at least 2 characters',
  }),
  key: z.string().refine((value) => value.trim() !== '', {
    message: 'key is required',
  }),
  description: z.string().optional(),
})

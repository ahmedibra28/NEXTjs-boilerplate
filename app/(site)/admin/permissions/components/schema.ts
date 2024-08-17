import * as z from 'zod'

export const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'name must be at least 2 characters',
  }),
  method: z.string().refine((value) => value !== '', {
    message: 'method is required',
  }),
  route: z.string().refine((value) => value !== '', {
    message: 'route is required',
  }),
  description: z.string().optional(),
})

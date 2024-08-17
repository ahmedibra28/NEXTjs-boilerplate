import * as z from 'zod'

export const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'Name is required',
  }),
  menu: z.string().refine((value) => value !== '', {
    message: 'Menu is required',
  }),
  sort: z.string(),
  path: z.string().refine((value) => value !== '', {
    message: 'Path is required',
  }),
  description: z.string().optional(),
})

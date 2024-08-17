import * as z from 'zod'

export const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'Name is required',
  }),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  clientPermissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
})

import * as z from 'zod'

export const FormSchema = z
  .object({
    name: z.string().refine((value) => value !== '', {
      message: 'Name is required',
    }),
    email: z
      .string()
      .email()
      .refine((value) => value !== '', {
        message: 'Email is required',
      }),
    roleId: z.string().refine((value) => value !== '', {
      message: 'Role is required',
    }),
    status: z.string().refine((value) => value !== '', {
      message: 'Status is required',
    }),
    password: z.string().refine((val) => val.length === 0 || val.length > 6, {
      message: "Password can't be less than 6 characters",
    }),
    confirmPassword: z
      .string()
      .refine((val) => val.length === 0 || val.length > 6, {
        message: "Confirm password can't be less than 6 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const newUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().url(),
});

export const updateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  bio: z.optional(z.string()),
  image: z.string().url(),
});

export type LoginUser = z.infer<typeof loginUserSchema>;
export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export const loginUserContract = zodContract(loginUserSchema);
export const newUserContract = zodContract(newUserSchema);
export const userContract = zodContract(userSchema);
export const updateUserContract = zodContract(updateUserSchema);

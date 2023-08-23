import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().url(),
  following: z.boolean(),
});

export type Profile = z.infer<typeof profileSchema>;

export const profileContract = zodContract(profileSchema);

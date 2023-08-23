import { zodContract } from '@farfetched/zod';
import { z } from 'zod';

export const tagSchema = z.string();
export const tagsSchema = z.array(tagSchema);

export type Tag = z.infer<typeof tagSchema>;
export type Tags = z.infer<typeof tagsSchema>;

export const tagsContract = zodContract(tagsSchema);

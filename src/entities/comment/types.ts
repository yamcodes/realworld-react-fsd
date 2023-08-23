import { zodContract } from '@farfetched/zod';
import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { profileSchema } from '~entities/profile/@x/article';

export const commentSchema = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  body: z.string(),
  author: profileSchema,
});

export const commentsSchema = z.array(commentSchema);

export const newCommentSchema = z.object({
  body: z.string(),
});

export type Comment = z.infer<typeof commentSchema>;
export type Comments = z.infer<typeof commentsSchema>;
export type NewComment = z.infer<typeof newCommentSchema>;

export const commentContract = zodContract(commentSchema);
export const commentsContract = zodContract(commentsSchema);

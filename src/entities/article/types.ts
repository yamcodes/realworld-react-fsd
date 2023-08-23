import { zodContract } from '@farfetched/zod';
import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { profileSchema } from '~entities/profile/@x/article';

export const articleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: profileSchema,
});

export const articlesSchema = z.object({
  articles: z.array(articleSchema),
  articlesCount: z.number(),
});

export const newArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
});

export const updateArticleSchema = z.object({
  title: z.optional(z.string()),
  description: z.optional(z.string()),
  body: z.optional(z.string()),
  tagList: z.optional(z.array(z.string())),
});

export type Article = z.infer<typeof articleSchema>;
export type Articles = z.infer<typeof articleSchema>;
export type NewArticle = z.infer<typeof newArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;

export const articleContract = zodContract(articleSchema);
export const articlesContract = zodContract(articlesSchema);

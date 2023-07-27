import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { mapArticle } from './lib';

type Query = {
  tag?: string;
  author?: string;
  favorited?: string;
  offset?: number;
  limit?: number;
};

type GetArticleParams = { query: Query; params?: RequestParams };

export const getArticlesFx = attach({
  source: $ctx,
  effect: async (ctx, { query, params }: GetArticleParams) => {
    const response = await ctx.restClient.articles.getArticles(query, params);
    return response.data.articles.map(mapArticle);
  },
});

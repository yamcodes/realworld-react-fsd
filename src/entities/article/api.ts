import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { mapArticle } from './lib';
import { Query } from './types';

type GetArticleParams = { query?: Query; params?: RequestParams };

export const getArticlesFx = attach({
  source: $ctx,
  effect: async (ctx, { query, params }: GetArticleParams) => {
    const response = await ctx.restClient.articles.getArticles(query, params);
    return response.data.articles.map(mapArticle);
  },
});

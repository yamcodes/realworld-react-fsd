import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { mapArticle } from './lib';
import { FeedQuery, NewArticle, Query, UpdateArticle } from './types';

type GetArticlesParams = { query?: Query; params?: RequestParams };

export const getArticlesFx = attach({
  source: $ctx,
  effect: async (ctx, { query, params }: GetArticlesParams) => {
    const response = await ctx.restClient.articles.getArticles(query, params);
    const articles = response.data.articles.map(mapArticle);
    return {
      articles,
      articlesCount: response.data.articlesCount,
    };
  },
});

type GetArticlesFeedParams = { query?: FeedQuery; params?: RequestParams };

export const getArticlesFeedFx = attach({
  source: $ctx,
  effect: async (ctx, { query, params }: GetArticlesFeedParams) => {
    const response = await ctx.restClient.articles.getArticlesFeed(
      query,
      params,
    );
    const articles = response.data.articles.map(mapArticle);
    return {
      articles,
      articlesCount: response.data.articlesCount,
    };
  },
});

type CreateArticleFavorite = { slug: string; params?: RequestParams };

export const createArticleFavoriteFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, params }: CreateArticleFavorite) => {
    const response = await ctx.restClient.articles.createArticleFavorite(
      slug,
      params,
    );
    return mapArticle(response.data.article);
  },
});

type DeleteArticleFavorite = { slug: string; params?: RequestParams };

export const deleteArticleFavoriteFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, params }: DeleteArticleFavorite) => {
    const response = await ctx.restClient.articles.deleteArticleFavorite(
      slug,
      params,
    );
    return mapArticle(response.data.article);
  },
});

type GetArticleParams = { slug: string; params?: RequestParams };

export const getArticleFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, params }: GetArticleParams) => {
    const response = await ctx.restClient.articles.getArticle(slug, params);
    return mapArticle(response.data.article);
  },
});

type CreateArticleParams = { article: NewArticle; params?: RequestParams };

export const createArticleFx = attach({
  source: $ctx,
  effect: async (ctx, { article, params }: CreateArticleParams) => {
    const response = await ctx.restClient.articles.createArticle(
      { article },
      params,
    );
    return mapArticle(response.data.article);
  },
});

type UpdateArticleParams = {
  slug: string;
  article: UpdateArticle;
  params?: RequestParams;
};

export const updateArticleFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, article, params }: UpdateArticleParams) => {
    const response = await ctx.restClient.articles.updateArticle(
      slug,
      { article },
      params,
    );
    return mapArticle(response.data.article);
  },
});

type DeleteArticleParams = { slug: string; params?: RequestParams };

export const deleteArticleFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, params }: DeleteArticleParams) => {
    await ctx.restClient.articles.deleteArticle(slug, params);
    return {};
  },
});

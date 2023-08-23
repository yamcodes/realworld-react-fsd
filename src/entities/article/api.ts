import { createMutation, createQuery } from '@farfetched/core';
import { attach } from 'effector';
import {
  ArticlesFeedQuery,
  ArticlesQuery,
  RequestParams,
} from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import {
  NewArticle,
  UpdateArticle,
  articlesContract,
  articleContract,
} from './types';

export type ArticlesQueryParams = {
  query?: ArticlesQuery;
  params?: RequestParams;
};

export const articlesQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { query, params }: ArticlesQueryParams) => {
      const response = await ctx.restClient.articles.getArticles(query, params);
      return response.data as unknown;
    },
  }),
  contract: articlesContract,
  name: 'articlesQuery',
});

export type ArticlesFeedQueryParams = {
  query?: ArticlesFeedQuery;
  params?: RequestParams;
};

export const articlesFeedQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { query, params }: ArticlesFeedQueryParams) => {
      const response = await ctx.restClient.articles.getArticlesFeed(
        query,
        params,
      );
      return response.data as unknown;
    },
  }),
  contract: articlesContract,
  name: 'articlesFeedQuery',
});

export type FavoriteArticleMutationParams = {
  slug: string;
  params?: RequestParams;
};

export const favoriteArticleMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, params }: FavoriteArticleMutationParams) => {
      const response = await ctx.restClient.articles.createArticleFavorite(
        slug,
        params,
      );
      return response.data.article as unknown;
    },
  }),
  contract: articleContract,
  name: 'favoriteArticleMutation',
});

export type UnfavoriteArticleMutationParams = {
  slug: string;
  params?: RequestParams;
};

export const unfavoriteArticleMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, params }: UnfavoriteArticleMutationParams) => {
      const response = await ctx.restClient.articles.deleteArticleFavorite(
        slug,
        params,
      );
      return response.data.article as unknown;
    },
  }),
  contract: articleContract,
  name: 'unfavoriteArticleMutation',
});

export type ArticleQueryParams = { slug: string; params?: RequestParams };

export const articleQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, params }: ArticleQueryParams) => {
      const response = await ctx.restClient.articles.getArticle(slug, params);
      return response.data.article as unknown;
    },
  }),
  contract: articleContract,
  name: 'articleQuery',
});

export type CreateArticleMutationParams = {
  article: NewArticle;
  params?: RequestParams;
};

export const createArticleMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { article, params }: CreateArticleMutationParams) => {
      const response = await ctx.restClient.articles.createArticle(
        { article },
        params,
      );
      return response.data.article as unknown;
    },
  }),
  contract: articleContract,
  name: 'createArticleMutation',
});

export type UpdateArticleMutationParams = {
  slug: string;
  article: UpdateArticle;
  params?: RequestParams;
};

export const updateArticleMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (
      ctx,
      { slug, article, params }: UpdateArticleMutationParams,
    ) => {
      const response = await ctx.restClient.articles.updateArticle(
        slug,
        { article },
        params,
      );
      return response.data.article as unknown;
    },
  }),
  contract: articleContract,
  name: 'updateArticleMutation',
});

export type DeleteArticleMutationParams = {
  slug: string;
  params?: RequestParams;
};

export const deleteArticleMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, params }: DeleteArticleMutationParams) => {
      await ctx.restClient.articles.deleteArticle(slug, params);
      return {} as unknown;
    },
  }),
  name: 'deleteArticleMutation',
});

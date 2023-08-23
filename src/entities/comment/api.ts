import { createMutation, createQuery } from '@farfetched/core';
import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { NewComment, commentContract, commentsContract } from './types';

export type CommentsQueryParams = {
  slug: string;
  params?: RequestParams;
};

export const commentsQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, params }: CommentsQueryParams) => {
      const response = await ctx.restClient.articles.getArticleComments(
        slug,
        params,
      );
      return response.data.comments as unknown;
    },
  }),
  contract: commentsContract,
  name: 'commentsQuery',
});

export type CreateCommentMutationParams = {
  slug: string;
  comment: NewComment;
  params?: RequestParams;
};

export const createCommentMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (
      ctx,
      { slug, comment, params }: CreateCommentMutationParams,
    ) => {
      const response = await ctx.restClient.articles.createArticleComment(
        slug,
        { comment },
        params,
      );
      return response.data.comment as unknown;
    },
  }),
  contract: commentContract,
  name: 'createCommentMutation',
});

export type DeleteCommentMutationParams = {
  slug: string;
  id: number;
  params?: RequestParams;
};

export const deleteCommentMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { slug, id, params }: DeleteCommentMutationParams) => {
      await ctx.restClient.articles.deleteArticleComment(slug, id, params);
      return {};
    },
  }),
  name: 'deleteCommentMutation',
});

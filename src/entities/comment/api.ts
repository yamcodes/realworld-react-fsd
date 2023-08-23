import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { mapComment } from './lib';
import { NewComment } from './types';

type GetCommentsParams = {
  slug: string;
  params?: RequestParams;
};

export const getCommentsFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, params }: GetCommentsParams) => {
    const response = await ctx.restClient.articles.getArticleComments(
      slug,
      params,
    );
    return response.data.comments.map(mapComment);
  },
});

export type CreateCommentParams = {
  slug: string;
  comment: NewComment;
  params?: RequestParams;
};

export const createCommentFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, comment, params }: CreateCommentParams) => {
    const response = await ctx.restClient.articles.createArticleComment(
      slug,
      { comment },
      params,
    );
    return mapComment(response.data.comment);
  },
});

export type DeleteCommentParams = {
  slug: string;
  id: number;
  params?: RequestParams;
};

export const deleteCommentFx = attach({
  source: $ctx,
  effect: async (ctx, { slug, id, params }: DeleteCommentParams) => {
    await ctx.restClient.articles.deleteArticleComment(slug, id, params);
    return {};
  },
});

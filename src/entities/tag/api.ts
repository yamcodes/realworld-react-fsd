import { createQuery } from '@farfetched/core';
import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { tagsContract } from './types';

export type TagsQueryParams = {
  params?: RequestParams;
};

export const tagsQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, params?: TagsQueryParams) => {
      const response = await ctx.restClient.tags.getTags(params?.params);
      return response.data.tags as unknown;
    },
  }),
  contract: tagsContract,
  name: 'tagsQuery',
});

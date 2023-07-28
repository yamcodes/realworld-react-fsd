import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

export const getTagsFx = attach({
  source: $ctx,
  effect: async (ctx, params?: RequestParams) => {
    const response = await ctx.restClient.tags.getTags(params);
    return response.data.tags;
  },
});

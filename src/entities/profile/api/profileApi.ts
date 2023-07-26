import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

type GetProfileParams = { username: string; params?: RequestParams };

export const getProfileFx = attach({
  source: $ctx,
  effect: async (ctx, { username, params }: GetProfileParams) => {
    const response = await ctx.restClient.profiles.getProfileByUsername(
      username,
      params,
    );
    return response.data.profile;
  },
});

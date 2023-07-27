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

type FollowProfileParams = { username: string; params?: RequestParams };

export const followProfileFx = attach({
  source: $ctx,
  effect: async (ctx, { username, params }: FollowProfileParams) => {
    const response = await ctx.restClient.profiles.followUserByUsername(
      username,
      params,
    );
    return response.data.profile;
  },
});

type UnfollowProfileParams = { username: string; params?: RequestParams };

export const unfollowProfileFx = attach({
  source: $ctx,
  effect: async (ctx, { username, params }: UnfollowProfileParams) => {
    const response = await ctx.restClient.profiles.unfollowUserByUsername(
      username,
      params,
    );
    return response.data.profile;
  },
});

import { createMutation, createQuery } from '@farfetched/core';
import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { profileContract } from './types';

export type ProfileQueryParams = { username: string; params?: RequestParams };

export const profileQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { username, params }: ProfileQueryParams) => {
      const response = await ctx.restClient.profiles.getProfileByUsername(
        username,
        params,
      );
      return response.data.profile as unknown;
    },
  }),
  contract: profileContract,
  name: 'profileQuery',
});

export type FollowProfileMutationParams = {
  username: string;
  params?: RequestParams;
};

export const followProfileMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { username, params }: FollowProfileMutationParams) => {
      const response = await ctx.restClient.profiles.followUserByUsername(
        username,
        params,
      );
      return response.data.profile as unknown;
    },
  }),
  contract: profileContract,
  name: 'followProfileMutation',
});

export type UnfollowProfileParams = {
  username: string;
  params?: RequestParams;
};

export const unfollowProfileMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { username, params }: UnfollowProfileParams) => {
      const response = await ctx.restClient.profiles.unfollowUserByUsername(
        username,
        params,
      );
      return response.data.profile as unknown;
    },
  }),
  contract: profileContract,
  name: 'unfollowProfileMutation',
});

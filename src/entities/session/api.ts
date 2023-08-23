import { createMutation, createQuery } from '@farfetched/core';
import { attach } from 'effector';
import { RequestParams } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { LoginUser, NewUser, UpdateUser, userContract } from './types';

export type SignupMutationParams = { user: NewUser; params?: RequestParams };

export const signupMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { user, params }: SignupMutationParams) => {
      const response = await ctx.restClient.users.createUser({ user }, params);
      return response.data.user as unknown;
    },
  }),
  contract: userContract,
  name: 'signupMutation',
});

export type SigninMutationParams = { user: LoginUser; params?: RequestParams };

export const signinMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { user, params }: SigninMutationParams) => {
      const response = await ctx.restClient.users.login({ user }, params);
      return response.data.user as unknown;
    },
  }),
  contract: userContract,
  name: 'signinMutation',
});

export type CurrentUserQueryParams = {
  params?: RequestParams;
};

export const currentUserQuery = createQuery({
  effect: attach({
    source: $ctx,
    effect: async (ctx, params?: CurrentUserQueryParams) => {
      const response = await ctx.restClient.user.getCurrentUser(params?.params);
      return response.data.user as unknown;
    },
  }),
  contract: userContract,
  name: 'currentUserQuery',
});

export type UpdateUserMutationParams = {
  user: UpdateUser;
  params?: RequestParams;
};

export const updateUserMutation = createMutation({
  effect: attach({
    source: $ctx,
    effect: async (ctx, { user, params }: UpdateUserMutationParams) => {
      const response = await ctx.restClient.user.updateCurrentUser(
        { user },
        params,
      );
      return response.data.user as unknown;
    },
  }),
  contract: userContract,
  name: 'updateUserMutation',
});

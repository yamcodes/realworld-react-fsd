import { attach } from 'effector';
import {
  LoginUserDto,
  NewUserDto,
  RequestParams,
  UpdateUserDto,
} from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { mapUser } from './lib';

type CreateUserParams = { user: NewUserDto; params?: RequestParams };

export const createUserFx = attach({
  name: 'createUserFx',
  source: $ctx,
  effect: async (ctx, { user, params }: CreateUserParams) => {
    const response = await ctx.restClient.users.createUser({ user }, params);
    return mapUser(response.data.user);
  },
});

type LoginUserParams = { user: LoginUserDto; params?: RequestParams };

export const loginUserFx = attach({
  name: 'loginUserFx',
  source: $ctx,
  effect: async (ctx, { user, params }: LoginUserParams) => {
    const response = await ctx.restClient.users.login({ user }, params);
    return mapUser(response.data.user);
  },
});

export const currentUserFx = attach({
  name: 'currentUserFx',
  source: $ctx,
  effect: async (ctx, params?: RequestParams) => {
    const response = await ctx.restClient.user.getCurrentUser(params);
    return mapUser(response.data.user);
  },
});

type UpdateUserParams = { user: UpdateUserDto; params?: RequestParams };

export const updateUserFx = attach({
  name: 'updateUserFx',
  source: $ctx,
  effect: async (ctx, { user, params }: UpdateUserParams) => {
    const response = await ctx.restClient.user.updateCurrentUser(
      { user },
      params,
    );
    return mapUser(response.data.user);
  },
});
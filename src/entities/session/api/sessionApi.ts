import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { attach } from 'effector';
import {
  GenericErrorModel,
  LoginUserDto,
  NewUserDto,
  RequestParams,
  UpdateUserDto,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
// import { addUser } from '../model/sessionModel';

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

function mapUser(userDto: UserDto): User {
  return userDto;
}

export const sessionKeys = {
  session: {
    root: ['session'],
    currentUser: () => [...sessionKeys.session.root, 'currentUser'],
  },

  mutation: {
    login: () => [...sessionKeys.session.root, 'login'],
    create: () => [...sessionKeys.session.root, 'create'],
  },
};

type UseCurrentUserQuery = UseQueryOptions<
  User,
  GenericErrorModel,
  User,
  string[]
>;
type UseCurrentUserOptions = Omit<UseCurrentUserQuery, 'queryKey' | 'queryFn'>;

export const useCurrentUser = (
  options?: UseCurrentUserOptions,
  params?: RequestParams,
) =>
  useQuery({
    queryKey: sessionKeys.session.currentUser(),
    queryFn: async ({ signal }) => {
      const response = await realworldApi.user.getCurrentUser({
        signal,
        ...params,
      });

      const user = mapUser(response.data.user);

      // addUser(user);

      return user;
    },
    ...options,
  });

type CreateUserParams = { user: NewUserDto; params?: RequestParams };

export const createUserFx = attach({
  name: 'createUserFx',
  source: $ctx,
  effect: async (ctx, { user, params }: CreateUserParams) => {
    const response = await ctx.restClient.users.createUser({ user }, params);
    return response.data.user;
  },
});

type LoginUserParams = { user: LoginUserDto; params?: RequestParams };

export const loginUserFx = attach({
  name: 'loginUserFx',
  source: $ctx,
  effect: async (ctx, { user, params }: LoginUserParams) => {
    const response = await ctx.restClient.users.login({ user }, params);
    return response.data.user;
  },
});

type CurrentUserParams = { params?: RequestParams };

export const currentUserFx = attach({
  name: 'currentUserFx',
  source: $ctx,
  effect: async (ctx, { params }: CurrentUserParams) => {
    const response = await ctx.restClient.user.getCurrentUser(params);
    return response.data.user;
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
    return response.data.user;
  },
});

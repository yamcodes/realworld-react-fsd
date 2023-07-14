import { createEffect } from 'effector';
import {
  GenericErrorModel,
  LoginUserDto,
  NewUserDto,
  UserDto,
  realworldApi,
} from '~shared/api/realworld';

// export const getUserFx = createEffect<void, UserDto, GenericErrorModel>({
//   name: 'getUserFx',
//   handler: async () => {
//     const response = await realworldApi.user.getCurrentUser();
//     return response.data.user;
//   },
// });

export const loginUserFx = createEffect<
  LoginUserDto,
  UserDto,
  GenericErrorModel
>({
  name: 'loginUserFx',
  handler: async (user) => {
    const response = await realworldApi.users.login({ user });
    return response.data.user;
  },
});

export const createUserFx = createEffect<
  NewUserDto,
  UserDto,
  GenericErrorModel
>({
  name: 'createUserFx',
  handler: async (user) => {
    const response = await realworldApi.users.createUser({ user });
    return response.data.user;
  },
});

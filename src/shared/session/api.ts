import { createEffect } from 'effector';
import {
  GenericErrorModel,
  RequestParams,
  UserDto,
  realworldApi,
} from '../api/realworld';

function wait<T>(ms: number, value?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, ms, value);
  });
}

const LocalStorageKey = 'testsession';

export const sessionLoadFx = createEffect<void, string | null>({
  name: 'sessionLoadFx',
  handler: async () => {
    const source = localStorage.getItem(LocalStorageKey);
    await wait(11500);

    if (!source) return null;

    return JSON.parse(source);
  },
});

export const sessionDeleteFx = createEffect({
  name: 'sessionDeleteFx',
  handler: async () => {
    localStorage.removeItem(LocalStorageKey);
    await wait(11500);
  },
});

export const sessionCreateFx = createEffect<string, string>({
  name: 'sessionCreateFx',
  handler: async (string) => {
    localStorage.setItem(LocalStorageKey, JSON.stringify(string));
    return string;
  },
});

export const userGetFx = createEffect<
  { params?: RequestParams },
  UserDto,
  GenericErrorModel
>({
  name: 'userGetFx',
  handler: async ({ params = {} }) => {
    const response = await realworldApi.user.getCurrentUser(params);
    return response.data.user;
  },
});

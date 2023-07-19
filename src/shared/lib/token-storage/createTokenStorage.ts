import {
  createEffect,
  createEvent,
  Event,
  createStore,
  sample,
} from 'effector';

type TokenStorageConfig = {
  initializeOn: Event<void>;
  tokenKey: string;
};

export function createTokenStorage(config: TokenStorageConfig) {
  const { initializeOn, tokenKey } = config;

  const getTokenFx = createEffect({
    handler: (key: string) => localStorage.getItem(key),
  });

  const setTokenFx = createEffect({
    handler: ({ key, value }: { key: string; value: string }) =>
      localStorage.setItem(key, value),
  });

  const removeTokenFx = createEffect({
    handler: (key: string) => localStorage.removeItem(key),
  });

  const updateToken = createEvent<string>();
  const clearToken = createEvent();

  const $token = createStore<string | null>(null);
  $token.on(setTokenFx.done, (_, { params }) => params.value);
  $token.on(removeTokenFx.done, () => null);

  sample({
    clock: initializeOn,
    fn: () => tokenKey,
    target: getTokenFx,
  });

  sample({
    clock: getTokenFx.doneData,
    target: $token,
  });

  sample({
    clock: updateToken,
    fn: (tokenValue) => ({ key: tokenKey, value: tokenValue }),
    target: setTokenFx,
  });

  sample({
    clock: clearToken,
    fn: () => tokenKey,
    target: removeTokenFx,
  });

  return { $token, updateToken, clearToken };
}

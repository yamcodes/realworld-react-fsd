import { createEffect, createEvent, createStore, sample } from 'effector';
import { TokenStorage } from '~shared/ctx';

type TokenStorageConfig = {
  storage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
  tokenKey: string;
  name: string;
};

export function createTokenStorage(config: TokenStorageConfig) {
  const { storage, tokenKey, name } = config;

  const initialize = createEvent({ name: name.concat('.initialize') });

  const $storage = createStore<TokenStorage>(
    {
      getToken: () => storage.getItem(tokenKey),
      updateToken: (token: string) => storage.setItem(tokenKey, token),
      clearToken: () => localStorage.removeItem(tokenKey),
    },
    { name: name.concat('.$storage') },
  );

  const setupTokenStorageFx = createEffect({
    name: name.concat('.setupTokenStorageFx'),
    handler: () => ({
      getToken: () => storage.getItem(tokenKey),
      updateToken: (token: string) => storage.setItem(tokenKey, token),
      clearToken: () => localStorage.removeItem(tokenKey),
    }),
  });

  sample({
    clock: initialize,
    target: setupTokenStorageFx,
  });

  sample({
    clock: setupTokenStorageFx.doneData,
    target: $storage,
  });

  return { initialize, $storage };
}

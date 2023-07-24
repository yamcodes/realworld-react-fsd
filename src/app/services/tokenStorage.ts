import { attach, createEvent, createStore, sample } from 'effector';
import { TokenStorage } from '~shared/ctx';

type TokenStorageConfig = {
  tokenKey: string;
};

export function createTokenStorage(config: TokenStorageConfig) {
  const { tokenKey } = config;

  const initialize = createEvent();

  const $storage = createStore<TokenStorage>({
    getToken: () => localStorage.getItem(tokenKey),
    updateToken: (token: string) => localStorage.setItem(tokenKey, token),
    clearToken: () => localStorage.removeItem(tokenKey),
  });

  const getInitTokenFx = attach({
    source: $storage,
    effect: (storage) => storage.getToken(),
  });

  const $initialToken = createStore<string | null>(null).on(
    getInitTokenFx.doneData,
    (_, token) => token,
  );

  sample({
    clock: initialize,
    target: getInitTokenFx,
  });

  return { initialize, $initialToken, $storage };
}

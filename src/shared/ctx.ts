// FIXME:
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@remix-run/router';
import { createStore } from 'effector';
import { Api } from './api/realworld';

export type TokenStorage = {
  getToken: () => string | null;
  updateToken: (token: string) => void;
  clearToken: () => void;
};

export type Ctx = {
  tokenStorage: TokenStorage;
  restClient: Api<string>;
  router: Router;
};

export const $ctx = createStore<Ctx>({
  tokenStorage: null as never,
  restClient: null as never,
  router: null as never,
});

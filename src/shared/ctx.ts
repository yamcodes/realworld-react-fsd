// FIXME:
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@remix-run/router';
import { Event, createStore } from 'effector';
import { Api } from './api/realworld';

type Credentials = {
  clear: Event<void>;
  update: Event<string>;
  token: string | null;
};

type Ctx = {
  router: Router;
  credentials: Credentials;
  restClient: Api<string>;
};

export const $ctx = createStore<Ctx>({
  router: null as never,
  credentials: null as never,
  restClient: null as never,
});

// FIXME:
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@remix-run/router';
import { Store, Event, createStore } from 'effector';
// import { debug } from 'patronum';

type Credentials = {
  clear: Event<void>;
  update: Event<string>;
  token: Store<string | null>;
};

type Ctx = {
  router: Router | null;
  credentials: Credentials | null;
};

export const $ctx = createStore<Ctx>({
  router: null,
  credentials: null,
});

// debug($ctx);

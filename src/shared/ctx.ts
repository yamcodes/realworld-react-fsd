// FIXME:
// eslint-disable-next-line import/no-extraneous-dependencies
import { Router } from '@remix-run/router';
import { createStore } from 'effector';

export const $ctx = createStore<{ router: Router | null }>({
  router: null,
});

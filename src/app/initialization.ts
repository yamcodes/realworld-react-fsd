// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import { sample, allSettled, fork, createEvent } from 'effector';
import { $ctx } from '~shared/ctx';
import {
  createRestClient,
  createRouting,
  createTokenStorage,
} from './services';

async function init() {
  const $$tokenStorage = createTokenStorage({ tokenKey: 'testsession' });
  const $$restClient = createRestClient({
    $token: $$tokenStorage.$initialToken,
  });
  const $$routing = createRouting();

  const initializeCtx = createEvent();
  const initializers = [
    $$tokenStorage.initialize,
    $$restClient.initialize,
    $$routing.initialize,
    initializeCtx,
  ];

  sample({
    clock: initializeCtx,
    source: {
      tokenStorage: $$tokenStorage.$storage,
      restClient: $$restClient.$client,
      router: $$routing.$router,
    },
    target: $ctx,
  });

  const scope = fork();

  attachReduxDevTools({
    name: 'Effector DevTools',
    scope,
    trace: true,
  });

  // eslint-disable-next-line no-restricted-syntax
  for await (const initialize of initializers) {
    await allSettled(initialize, { scope });
  }

  return { scope };
}

export const { scope } = await init();

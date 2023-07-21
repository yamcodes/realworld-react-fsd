// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import {
  sample,
  createStore,
  combine,
  allSettled,
  fork,
  createEvent,
} from 'effector';
import { $ctx } from '~shared/ctx';
import {
  createRestClient,
  createRouting,
  createTokenStorage,
} from './services';

async function init() {
  const $$tokenStorage = createTokenStorage({ tokenKey: 'testsession' });
  const $$restClient = createRestClient({ $token: $$tokenStorage.$token });
  const $$routing = createRouting();

  const initializeCtx = createEvent();
  sample({
    // @ts-ignore
    clock: initializeCtx,
    source: {
      tokenStorage: combine({
        clear: createStore($$tokenStorage.clearToken),
        update: createStore($$tokenStorage.updateToken),
        token: $$tokenStorage.$token,
      }),
      router: $$routing.$router,
      restClient: $$restClient.$client,
    },
    target: $ctx,
  });

  const initializers = [
    $$tokenStorage.initialize,
    $$restClient.initialize,
    $$routing.initialize,
    initializeCtx,
  ];

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

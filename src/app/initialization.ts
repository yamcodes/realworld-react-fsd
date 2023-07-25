// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import { allSettled, fork, combine } from 'effector';
import { $$sessionModel } from '~entities/session';
import { $ctx } from '~shared/ctx';
import {
  createContext,
  createRestClient,
  createRouting,
  createTokenStorage,
} from './services';

async function init() {
  const $$tokenStorage = createTokenStorage({
    storage: localStorage,
    tokenKey: 'testsession',
    name: 'localStorage',
  });
  const $$restClient = createRestClient();
  const $$routing = createRouting();

  const $context = combine({
    tokenStorage: $$tokenStorage.$storage,
    restClient: $$restClient.$client,
    router: $$routing.$router,
  });

  const $$context = createContext({
    $context,
    $store: $ctx,
  });

  const initializers = [
    $$tokenStorage.initialize,
    $$restClient.initialize,
    $$routing.initialize,
    $$context.initilize,
    $$sessionModel.initilize,
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

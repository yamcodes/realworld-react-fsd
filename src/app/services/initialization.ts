// eslint-disable-next-line import/no-extraneous-dependencies
import { attachReduxDevTools } from '@effector/redux-devtools-adapter';
import { allSettled, fork, combine, sample } from 'effector';
import { $$sessionModel } from '~entities/session';
import { $ctx } from '~shared/ctx';
import { createRestClient } from './restClient';
import { createRouting } from './router';
import { createTokenStorage } from './tokenStorage';

export async function init() {
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

  const initializers = [
    $$tokenStorage.initialize,
    $$restClient.initialize,
    $$sessionModel.init,
    $$routing.initialize,
  ];

  sample({
    source: $context,
    target: $ctx,
  });

  const scope = fork();

  // attachReduxDevTools({
  //   name: 'My App',
  //   scope,
  // });

  // eslint-disable-next-line no-restricted-syntax
  for await (const initialize of initializers) {
    await allSettled(initialize, { scope });
  }

  return { scope };
}

import { createStore, sample, createEvent, createEffect } from 'effector';
import { Api } from '~shared/api/realworld';

export function createRestClient() {
  const initialize = createEvent({ name: 'restClient.initialize' });

  const $client = createStore<Api<string>>(null as never);

  const setupRestClientFx = createEffect({
    handler: () => {
      const client = new Api<string>({
        baseApiParams: {
          headers: {
            'Content-Type': 'application/json',
          },
          format: 'json',
        },
        securityWorker: (token) =>
          token ? { headers: { Authorization: `Token ${token}` } } : {},
      });

      return client;
    },
  });

  sample({
    clock: initialize,
    target: setupRestClientFx,
  });

  sample({
    clock: setupRestClientFx.doneData,
    target: $client,
  });

  return { initialize, $client };
}

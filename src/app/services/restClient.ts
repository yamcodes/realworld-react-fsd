import { Store, createStore, sample, attach, createEvent } from 'effector';
import { Api } from '~shared/api/realworld';

type RestClientConfig = {
  $token: Store<string | null>;
};

export function createRestClient(config: RestClientConfig) {
  const { $token } = config;

  const initialize = createEvent();

  const $client = createStore<Api<string> | null>(null);

  const setupRestClientFx = attach({
    name: 'setupRestClientFx',
    source: { userToken: $token },
    effect: ({ userToken }) => {
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

      client.setSecurityData(userToken);

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

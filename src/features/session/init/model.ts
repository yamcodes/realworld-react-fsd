import { attach, createEvent, createStore, sample } from 'effector';
import { $$sessionModel, sessionApi } from '~entities/session';
import { $ctx } from '~shared/ctx';

export function createModel() {
  const initialize = createEvent({ name: 'sessionInit' });

  const initilizeFx = attach({
    source: $ctx,
    effect: (ctx) => {
      const token = ctx.tokenStorage.getToken();
      if (token) ctx.restClient.setSecurityData(token);
      return token;
    },
  });

  const $cancelToken = createStore('requestCurrentUserFx');
  const requestCurrentUserFx = attach({
    source: $cancelToken,
    effect: async (cancelToken) =>
      sessionApi.currentUserFx({ params: { cancelToken } }),
  });

  sample({
    clock: initialize,
    target: initilizeFx,
  });

  sample({
    clock: initilizeFx.doneData,
    filter: Boolean,
    target: requestCurrentUserFx,
  });

  sample({
    clock: requestCurrentUserFx.doneData,
    target: $$sessionModel.update,
  });

  return { initialize };
}

import { attach, createEvent, createStore, sample } from 'effector';
import { UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { currentUserFx } from '../api/sessionApi';

function createSessionModel() {
  const initilize = createEvent();
  const update = createEvent<UserDto>();
  const clear = createEvent();

  const initilizeFx = attach({
    source: $ctx,
    effect: (ctx) => {
      const token = ctx.tokenStorage.getToken();
      if (token) ctx.restClient.setSecurityData(token);
      return token;
    },
  });

  const updateFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => {
      ctx.tokenStorage.updateToken(token);
      ctx.restClient.setSecurityData(token);
    },
  });

  const clearFx = attach({
    source: $ctx,
    effect: (ctx) => {
      ctx.tokenStorage.clearToken();
      ctx.restClient.setSecurityData(null);
    },
  });

  const $cancelToken = createStore('requestCurrentUserFx');
  const requestCurrentUserFx = attach({
    source: $cancelToken,
    effect: async (cancelToken) => currentUserFx({ params: { cancelToken } }),
  });

  const $visitor = createStore<UserDto | null>(null)
    .on(requestCurrentUserFx.doneData, (_, user) => user)
    .on(update, (_, user) => user)
    .reset(clear);

  const $error = createStore<Error | null>(null).on(
    requestCurrentUserFx.failData,
    (_, error) => error,
  );

  sample({
    clock: initilize,
    target: initilizeFx,
  });

  sample({
    clock: initilizeFx.doneData,
    filter: Boolean,
    target: requestCurrentUserFx,
  });

  sample({
    clock: [update, requestCurrentUserFx.doneData],
    fn: (user) => user.token,
    target: updateFx,
  });

  sample({
    clock: [clear, requestCurrentUserFx.fail],
    target: clearFx,
  });

  return { initilize, update, clear, $visitor, $error };
}

export const $$sessionModel = createSessionModel();

import { attach, createEvent, createStore, sample } from 'effector';
import { UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { currentUserFx } from '../api/sessionApi';

function createSessionModel() {
  const initilize = createEvent();

  const getStorageTokenFx = attach({
    source: $ctx,
    effect: (ctx) => ctx.tokenStorage.getToken(),
  });

  const updateSessionFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => {
      ctx.tokenStorage.updateToken(token);
      ctx.restClient.setSecurityData(token);
    },
  });

  const clearSessionFx = attach({
    source: $ctx,
    effect: (ctx) => {
      ctx.tokenStorage.clearToken();
      ctx.restClient.setSecurityData(null);
    },
  });

  const $token = createStore<string | null>(null).on(
    getStorageTokenFx.doneData,
    (_, token) => token,
  );

  const $isAuth = $token.map(Boolean);

  const $visitor = createStore<UserDto | null>(null).on(
    currentUserFx.doneData,
    (_, user) => user,
  );

  const $error = createStore<Error | null>(null).on(
    currentUserFx.failData,
    (_, error) => error,
  );

  sample({
    clock: initilize,
    target: getStorageTokenFx,
  });

  sample({
    clock: getStorageTokenFx.doneData,
    filter: (token) => Boolean(token),
    target: updateSessionFx,
  });

  return { initilize, $visitor, $error };
}

export const $$sessionModel = createSessionModel();

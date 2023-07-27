import { attach, createEvent, createStore, sample } from 'effector';
import { UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

function createSessionModel() {
  const update = createEvent<UserDto>();
  const clear = createEvent();

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

  const $visitor = createStore<UserDto | null>(null)
    .on(update, (_, user) => user)
    .reset(clear);

  // const $error = createStore<Error | null>(null).on(
  //   requestCurrentUserFx.failData,
  //   (_, error) => error,
  // );

  sample({
    clock: update,
    fn: (user) => user.token,
    target: updateFx,
  });

  sample({
    clock: clear,
    target: clearFx,
  });

  return { update, clear, $visitor };
}

export const $$sessionModel = createSessionModel();

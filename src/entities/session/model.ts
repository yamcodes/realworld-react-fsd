import {
  attach,
  createEvent,
  createEffect,
  createStore,
  sample,
} from 'effector';
import { UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';
import { currentUserFx } from './api';

const name = 'session';

function createSessionModel() {
  const init = createEvent({ name: name.concat('.init') });
  const update = createEvent<UserDto>({ name: name.concat('.update') });
  const clear = createEvent({ name: name.concat('.clear') });

  const requestCurrentUserFx = createEffect({
    name: name.concat('.requestCurrentUserFx'),
    handler: currentUserFx,
  });

  const initFx = attach({
    name: name.concat('.initFx'),
    source: $ctx,
    effect: (ctx) => {
      const token = ctx.tokenStorage.getToken();
      if (token) {
        ctx.restClient.setSecurityData(token);
        return requestCurrentUserFx();
      }
      return null;
    },
  });

  const updateFx = attach({
    name: name.concat('.updateFx'),
    source: $ctx,
    effect: (ctx, token: string) => {
      ctx.tokenStorage.updateToken(token);
      ctx.restClient.setSecurityData(token);
    },
  });

  const clearFx = attach({
    name: name.concat('.clearFx'),
    source: $ctx,
    effect: (ctx) => {
      ctx.tokenStorage.clearToken();
      ctx.restClient.setSecurityData(null);
    },
  });

  const $visitor = createStore<UserDto | null>(null, {
    name: name.concat('.$visitor'),
  })
    .on(initFx.doneData, (_, user) => user)
    .on(update, (_, user) => user)
    .reset(clear);

  sample({
    clock: init,
    target: initFx,
  });

  sample({
    clock: update,
    fn: (user) => user.token,
    target: updateFx,
  });

  sample({
    clock: clear,
    target: clearFx,
  });

  return { init, update, clear, $visitor };
}

export const { init, update, clear, $visitor } = createSessionModel();

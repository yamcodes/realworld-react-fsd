import { attachOperation } from '@farfetched/core';
import { attach, createEvent, createStore, sample } from 'effector';
import { $ctx } from '~shared/ctx';
import { currentUserQuery } from './api';
import { User } from './types';

function createSessionModel() {
  const init = createEvent();
  const update = createEvent<User>();
  const clear = createEvent();

  const attachedCurrentUserQuery = attachOperation(currentUserQuery);

  const getUserTokenFx = attach({
    source: $ctx,
    effect: async (ctx) => {
      const token = ctx.tokenStorage.getToken();
      if (token) {
        ctx.restClient.setSecurityData(token);
        return Promise.resolve(token);
      }

      return Promise.reject(new Error('token not found'));
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

  const $visitor = createStore<User | null>(null)
    .on(
      attachedCurrentUserQuery.finished.success,
      (_, { result: user }) => user,
    )
    .on(attachedCurrentUserQuery.finished.failure, () => null)
    .on(update, (_, user) => user)
    .reset(clear);

  sample({
    clock: init,
    target: getUserTokenFx,
  });

  sample({
    clock: getUserTokenFx.done,
    fn: () => {},
    target: attachedCurrentUserQuery.start,
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

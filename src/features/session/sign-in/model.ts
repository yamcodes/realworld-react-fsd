import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, sessionApi } from '~entities/session';
import { LoginUserDto } from '~shared/api/realworld';

export function createModel() {
  const signin = createEvent<LoginUserDto>();

  const $$loginUserQuery = createQuery({
    handler: sessionApi.loginUserFx,
  });

  sample({
    clock: signin,
    fn: (user) => ({ user }),
    target: $$loginUserQuery.start,
  });

  sample({
    clock: $$loginUserQuery.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    signin,
    reset: $$loginUserQuery.reset,
    $pending: $$loginUserQuery.$pending,
    $error: $$loginUserQuery.$error,
  };
}

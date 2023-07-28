import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, sessionApi } from '~entities/session';
import { LoginUserDto } from '~shared/api/realworld';

export function createModel() {
  const signin = createEvent<LoginUserDto>({ name: 'session.signin' });

  const $$signinQuery = createQuery({
    handler: sessionApi.loginUserFx,
    name: 'session.signinQuery',
  });

  sample({
    clock: signin,
    fn: (user) => ({ user }),
    target: $$signinQuery.start,
  });

  sample({
    clock: $$signinQuery.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    signin,
    reset: $$signinQuery.reset,
    $pending: $$signinQuery.$pending,
    $error: $$signinQuery.$error,
  };
}

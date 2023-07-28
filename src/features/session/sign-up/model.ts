import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, sessionApi } from '~entities/session';
import { NewUserDto } from '~shared/api/realworld';

export function createModel() {
  const signup = createEvent<NewUserDto>({ name: 'session.signup' });

  const $$signupQuery = createQuery({
    handler: sessionApi.createUserFx,
    name: 'session.signupQuery',
  });

  sample({
    clock: signup,
    fn: (user) => ({ user }),
    target: $$signupQuery.start,
  });

  sample({
    clock: $$signupQuery.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    signup,
    reset: $$signupQuery.reset,
    $pending: $$signupQuery.$pending,
    $error: $$signupQuery.$error,
  };
}

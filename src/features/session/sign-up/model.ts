import { attachOperation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, NewUser, sessionApi } from '~entities/session';

export function createModel() {
  const signup = createEvent<NewUser>({ name: 'session.signup' });

  const signupMutation = attachOperation(sessionApi.signupMutation);

  sample({
    clock: signup,
    fn: (user) => ({ user }),
    target: signupMutation.start,
  });

  sample({
    clock: signupMutation.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    signup,
    failure: signupMutation.finished.failure,
    success: signupMutation.finished.success,
    $pending: signupMutation.$pending,
  };
}

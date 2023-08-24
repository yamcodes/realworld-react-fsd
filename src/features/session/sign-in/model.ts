import { attachOperation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, LoginUser, sessionApi } from '~entities/session';

export function createModel() {
  const signin = createEvent<LoginUser>({ name: 'session.signin' });

  const signinMutation = attachOperation(sessionApi.signinMutation);

  sample({
    clock: signin,
    fn: (user) => ({ user }),
    target: signinMutation.start,
  });

  sample({
    clock: signinMutation.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    signin,
    failure: signinMutation.finished.failure,
    success: signinMutation.finished.success,
    $pending: signinMutation.$pending,
  };
}

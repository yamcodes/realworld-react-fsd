import { attachOperation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, UpdateUser, sessionApi } from '~entities/session';

export function createModel() {
  const update = createEvent<UpdateUser>();

  const updateUserMutation = attachOperation(sessionApi.updateUserMutation);

  sample({
    clock: update,
    fn: (user) => ({ user }),
    target: updateUserMutation.start,
  });

  sample({
    clock: updateUserMutation.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    update,
    failure: updateUserMutation.finished.failure,
    $pending: updateUserMutation.$pending,
  };
}

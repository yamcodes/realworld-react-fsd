import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { $$sessionModel, sessionApi } from '~entities/session';
import { UpdateUserDto } from '~shared/api/realworld';

export function createModel() {
  const update = createEvent<UpdateUserDto>({ name: 'session.update' });

  const $$updateQuery = createQuery({
    handler: sessionApi.updateUserFx,
    name: 'session.updateQuery',
  });

  sample({
    clock: update,
    fn: (user) => ({ user }),
    target: $$updateQuery.start,
  });

  sample({
    clock: $$updateQuery.finished.success,
    fn: (data) => data.result,
    target: $$sessionModel.update,
  });

  return {
    update,
    reset: $$updateQuery.reset,
    $pending: $$updateQuery.$pending,
    $error: $$updateQuery.$error,
  };
}

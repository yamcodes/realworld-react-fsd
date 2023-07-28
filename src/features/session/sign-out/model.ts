import { createEvent, sample } from 'effector';
import { $$sessionModel } from '~entities/session';

export function createModel() {
  const signout = createEvent({ name: 'session.signout' });

  sample({
    clock: signout,
    target: $$sessionModel.clear,
  });

  return {
    signout,
  };
}

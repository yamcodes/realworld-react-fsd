import { createEvent, sample } from 'effector';
import { $$sessionModel } from '~entities/session';

export function createModel() {
  const signout = createEvent();

  sample({
    clock: signout,
    target: $$sessionModel.clear,
  });

  return {
    signout,
  };
}

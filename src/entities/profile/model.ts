import { createEvent, createStore } from 'effector';
import { Profile } from './types';

export type ProfileModel = ReturnType<typeof createModel>;

export function createModel() {
  const init = createEvent<Profile>();
  const reset = createEvent();

  const $profile = createStore<Profile>(null as never)
    .on(init, (_, profile) => profile)
    .reset(reset);

  return { init, reset, $profile };
}

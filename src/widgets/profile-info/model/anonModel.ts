import { createQuery } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { profileApi } from '~entities/profile';
import { createNavigateMobel } from '../lib';

type ProfileInfoAnonConfig = {
  $username: Store<string | null>;
};

export type ProfileInfoAnonModel = ReturnType<typeof createAnonModel>;

export function createAnonModel(config: ProfileInfoAnonConfig) {
  const { $username } = config;

  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();
  const navigateToLogin = createEvent();

  const $$getProfileQuery = createQuery({
    handler: profileApi.getProfileFx,
    name: 'getProfileQuery',
  });

  const $$navigateToLogin = createNavigateMobel({ path: '/login' });

  sample({
    clock: init,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
    target: $$getProfileQuery.start,
  });

  sample({
    clock: navigateToLogin,
    target: $$navigateToLogin.navigate,
  });

  sample({
    clock: reset,
    target: $$getProfileQuery.reset,
  });

  sample({
    clock: unmounted,
    target: reset,
  });

  return {
    init,
    unmounted,
    navigateToLogin,
    $profile: $$getProfileQuery.$data,
    $pending: $$getProfileQuery.$pending,
    $error: $$getProfileQuery.$error,
  };
}

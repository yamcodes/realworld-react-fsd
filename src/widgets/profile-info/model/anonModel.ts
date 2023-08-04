import { createQuery } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { debug } from 'patronum';
import { profileApi } from '~entities/profile';
import { ProfileInfoModel } from './types';

type ProfileInfoAnonConfig = {
  $username: Store<string | null>;
};

export function createAnonModel(
  config: ProfileInfoAnonConfig,
): ProfileInfoModel {
  const { $username } = config;

  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();

  const profileQuery = createQuery({
    handler: profileApi.getProfileFx,
    name: 'profileQuery',
  });

  sample({
    clock: init,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
    target: profileQuery.start,
  });

  sample({
    clock: reset,
    target: profileQuery.reset,
  });

  sample({
    clock: unmounted,
    target: reset,
  });

  const $profile = profileQuery.$data;
  const { $pending } = profileQuery;
  const { $error } = profileQuery;

  debug({ trace: true }, $profile);

  return {
    init,
    unmounted,
    reset,
    $profile,
    $pending,
    $error,
  };
}

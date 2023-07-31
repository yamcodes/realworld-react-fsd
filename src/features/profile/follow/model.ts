import { createQuery } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type FollowProfileModel = ReturnType<typeof createModel>;

type FollowProfileConfig = {
  $profile: Store<Profile | null>;
};

export function createModel(config: FollowProfileConfig) {
  const { $profile } = config;

  const follow = createEvent();

  const optimisticallyUpdate = createEvent<Profile>();
  const rollbackUpdate = createEvent<Profile>();
  const updateSettled = createEvent();

  const $$followProfileQuery = createQuery({
    name: 'followProfileQuery',
    handler: profileApi.followProfileFx,
  });

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: follow,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
    target: $$followProfileQuery.start,
  });

  sample({
    clock: $$followProfileQuery.start,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: true }),
    target: optimisticallyUpdate,
  });

  sample({
    clock: $$followProfileQuery.finished.failure,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: false }),
    target: rollbackUpdate,
  });

  sample({
    clock: $$followProfileQuery.finished.finally,
    target: updateSettled,
  });

  return {
    optimisticallyUpdate,
    rollbackUpdate,
    updateSettled,
    follow,
    reset: $$followProfileQuery.reset,
    $username,
  };
}

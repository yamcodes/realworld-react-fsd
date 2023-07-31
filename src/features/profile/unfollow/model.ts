import { createQuery } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type UnfollowProfileModel = ReturnType<typeof createModel>;

type UnfollowProfileConfig = {
  $profile: Store<Profile | null>;
};

export function createModel(config: UnfollowProfileConfig) {
  const { $profile } = config;

  const unfollow = createEvent();

  const optimisticallyUpdate = createEvent<Profile>();
  const rollbackUpdate = createEvent<Profile>();
  const updateSettled = createEvent();

  const $$unfollowProfileQuery = createQuery({
    name: 'unfollowProfileQuery',
    handler: profileApi.unfollowProfileFx,
  });

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: unfollow,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
    target: $$unfollowProfileQuery.start,
  });

  sample({
    clock: $$unfollowProfileQuery.start,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: false }),
    target: optimisticallyUpdate,
  });

  sample({
    clock: $$unfollowProfileQuery.finished.failure,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: true }),
    target: rollbackUpdate,
  });

  sample({
    clock: $$unfollowProfileQuery.finished.finally,
    target: updateSettled,
  });

  return {
    optimisticallyUpdate,
    rollbackUpdate,
    updateSettled,
    unfollow,
    $username,
    reset: $$unfollowProfileQuery.reset,
  };
}

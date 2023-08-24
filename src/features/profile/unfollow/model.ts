import { attachOperation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type UnfollowProfileModel = ReturnType<typeof createModel>;

export function createModel() {
  const unfollow = createEvent<Profile>();
  const mutated = createEvent<Profile>();

  const unfollowProfileMutation = attachOperation(
    profileApi.unfollowProfileMutation,
  );

  const $profile = restore(unfollow, null);

  sample({
    clock: unfollow,
    source: $profile,
    filter: Boolean,
    fn: ({ username }) => ({ username }),
    target: unfollowProfileMutation.start,
  });

  sample({
    clock: unfollowProfileMutation.start,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: false }),
    target: mutated,
  });

  return {
    unfollow,
    mutated,
    failure: unfollowProfileMutation.finished.failure,
    settled: unfollowProfileMutation.finished.finally,
  };
}

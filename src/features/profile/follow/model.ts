import { attachOperation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type FollowProfileModel = ReturnType<typeof createModel>;

export function createModel() {
  const follow = createEvent<Profile>();
  const mutated = createEvent<Profile>();

  const followProfileMutation = attachOperation(
    profileApi.followProfileMutation,
  );

  const $profile = restore(follow, null);

  sample({
    clock: follow,
    source: $profile,
    filter: Boolean,
    fn: ({ username }) => ({ username }),
    target: followProfileMutation.start,
  });

  sample({
    clock: followProfileMutation.start,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({ ...profile, following: true }),
    target: mutated,
  });

  return {
    follow,
    mutated,
    failure: followProfileMutation.finished.failure,
    settled: followProfileMutation.finished.finally,
  };
}

import { createMutation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type FollowProfileModel = ReturnType<typeof createModel>;

export function createModel() {
  const follow = createEvent<Profile>();
  const optimisticallyUpdate = createEvent<Profile>();

  const followProfileMutation = createMutation({
    name: 'followProfileMutation',
    handler: profileApi.followProfileFx,
  });

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
    target: optimisticallyUpdate,
  });

  return {
    followProfileMutation,
    optimisticallyUpdate,
    follow,
  };
}

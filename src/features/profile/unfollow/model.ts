import { createMutation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';

export type UnfollowProfileModel = ReturnType<typeof createModel>;

export function createModel() {
  const unfollow = createEvent<Profile>();
  const optimisticallyUpdate = createEvent<Profile>();

  const unfollowProfileMutation = createMutation({
    name: 'unfollowProfileMutation',
    handler: profileApi.unfollowProfileFx,
  });

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
    target: optimisticallyUpdate,
  });

  return {
    unfollowProfileMutation,
    optimisticallyUpdate,
    unfollow,
  };
}

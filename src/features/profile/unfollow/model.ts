import { createMutation } from '@farfetched/core';
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

  const unfollowProfileMutation = createMutation({
    name: 'unfollowProfileMutation',
    handler: profileApi.unfollowProfileFx,
  });

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: unfollow,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
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
    $username,
  };
}

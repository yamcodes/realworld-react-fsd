import { createMutation } from '@farfetched/core';
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

  const followProfileMutation = createMutation({
    name: 'followProfileMutation',
    handler: profileApi.followProfileFx,
  });

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: follow,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
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
    $username,
  };
}

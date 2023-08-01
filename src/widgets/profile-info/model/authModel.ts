import { createQuery, update } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { profileApi } from '~entities/profile';
import { followModel, unfollowModel } from '~features/profile';

export type ProfileInfoAuthModel = ReturnType<typeof createAuthModel>;

type ProfileInfoAuthConfig = {
  $username: Store<string | null>;
};

export function createAuthModel(config: ProfileInfoAuthConfig) {
  const { $username } = config;

  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();

  const profileQuery = createQuery({
    handler: profileApi.getProfileFx,
    name: 'profileQuery',
  });

  const $$followProfile = followModel.createModel({
    $profile: profileQuery.$data,
  });
  const $$unfollowProfile = unfollowModel.createModel({
    $profile: profileQuery.$data,
  });

  sample({
    clock: init,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username, params: { secure: true } }),
    target: profileQuery.start,
  });

  update(profileQuery, {
    on: $$followProfile.followProfileMutation,
    by: {
      success: ({ mutation }) => ({
        result: mutation.result,
      }),
      failure: ({ mutation }) => ({
        error: mutation.error,
      }),
    },
  });

  update(profileQuery, {
    on: $$unfollowProfile.unfollowProfileMutation,
    by: {
      success: ({ mutation }) => ({
        result: mutation.result,
        // refetch: true,
      }),
      failure: ({ mutation }) => ({
        error: mutation.error,
      }),
    },
  });

  sample({
    clock: [
      $$followProfile.optimisticallyUpdate,
      $$unfollowProfile.optimisticallyUpdate,
    ],
    target: profileQuery.$data,
  });

  sample({
    clock: reset,
    target: profileQuery.reset,
  });

  sample({
    clock: unmounted,
    target: reset,
  });

  return {
    init,
    unmounted,
    $$followProfile,
    $$unfollowProfile,
    profileQuery,
  };
}

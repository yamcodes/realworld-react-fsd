import { createQuery } from '@farfetched/core';
import { Store, createEvent, createStore, sample } from 'effector';
import { profileApi, Profile } from '~entities/profile';
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

  const $$getProfileQuery = createQuery({
    handler: profileApi.getProfileFx,
    name: 'getProfileQuery',
  });

  const $profile = createStore<Profile | null>(null).reset(reset);

  const $$followProfile = followModel.createModel({ $profile });
  const $$unfollowProfile = unfollowModel.createModel({ $profile });

  sample({
    clock: [
      init,
      // $$followProfile.updateSettled,
      // $$unfollowProfile.updateSettled,
    ],
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username, params: { secure: true } }),
    target: $$getProfileQuery.start,
  });

  sample({
    clock: $$getProfileQuery.finished.success,
    fn: (data) => data.result,
    target: $profile,
  });

  sample({
    clock: [
      $$followProfile.optimisticallyUpdate,
      $$followProfile.rollbackUpdate,
      $$unfollowProfile.optimisticallyUpdate,
      $$unfollowProfile.rollbackUpdate,
    ],
    target: $profile,
  });

  sample({
    clock: reset,
    target: [
      $$getProfileQuery.reset,
      $$followProfile.reset,
      $$unfollowProfile.reset,
    ],
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
    $profile,
    $pending: $$getProfileQuery.$pending,
    $error: $$getProfileQuery.$error,
  };
}

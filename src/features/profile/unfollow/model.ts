import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';
import { createQuery } from '~shared/api/createQuery';

export type UnfollowProfileModel = Omit<
  ReturnType<typeof createModel>,
  'initialize'
>;

export function createModel() {
  const initialize = createEvent<Profile>();
  const unfollowed = createEvent();

  const optimisticallyUpdate = createEvent<Profile>();
  const rollbackUpdate = createEvent<Profile>();
  const updateSettled = createEvent();

  const $$unfollowProfileQuery = createQuery({
    name: 'unfollowProfileQuery',
    fx: profileApi.unfollowProfileFx,
  });

  const $profile = restore(initialize, null)
    .on(unfollowed, (profile) =>
      profile ? { ...profile, following: false } : null,
    )
    .on($$unfollowProfileQuery.finished.success, (_, profile) => profile)
    .reset($$unfollowProfileQuery.finished.failure);

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: unfollowed,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({
      username: profile.username,
    }),
    target: $$unfollowProfileQuery.start,
  });

  sample({
    clock: $$unfollowProfileQuery.start,
    source: $profile,
    filter: Boolean,
    target: optimisticallyUpdate,
  });

  sample({
    clock: $$unfollowProfileQuery.finished.failure,
    source: $profile,
    filter: Boolean,
    target: rollbackUpdate,
  });

  sample({
    clock: $$unfollowProfileQuery.finished.finally,
    target: updateSettled,
  });

  return {
    initialize,
    optimisticallyUpdate,
    rollbackUpdate,
    updateSettled,
    $username,
    unfollowed,
  };
}

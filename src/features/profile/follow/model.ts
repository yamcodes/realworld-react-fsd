import { createEvent, restore, sample } from 'effector';
import { Profile, profileApi } from '~entities/profile';
import { createQuery } from '~shared/api/createQuery';

export type FollowProfileModel = Omit<
  ReturnType<typeof createModel>,
  'initialize'
>;

export function createModel() {
  const initialize = createEvent<Profile>();
  const followed = createEvent();

  const optimisticallyUpdate = createEvent<Profile>();
  const rollbackUpdate = createEvent<Profile>();
  const updateSettled = createEvent();

  const $$followProfileQuery = createQuery({
    name: 'followProfileQuery',
    fx: profileApi.followProfileFx,
  });

  const $profile = restore(initialize, null)
    .on(followed, (profile) =>
      profile ? { ...profile, following: true } : null,
    )
    .on($$followProfileQuery.finished.success, (_, profile) => profile)
    .reset($$followProfileQuery.finished.failure);

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: followed,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({
      username: profile.username,
    }),
    target: $$followProfileQuery.start,
  });

  sample({
    clock: $$followProfileQuery.start,
    source: $profile,
    filter: Boolean,
    target: optimisticallyUpdate,
  });

  sample({
    clock: $$followProfileQuery.finished.failure,
    source: $profile,
    filter: Boolean,
    target: rollbackUpdate,
  });

  sample({
    clock: $$followProfileQuery.finished.finally,
    target: updateSettled,
  });

  return {
    initialize,
    optimisticallyUpdate,
    rollbackUpdate,
    updateSettled,
    $username,
    followed,
  };
}

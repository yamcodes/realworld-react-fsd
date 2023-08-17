import { createEvent, sample } from 'effector';
import { Profile } from '~entities/profile';
import { followModel, unfollowModel } from '~features/profile';

// type FollowTogglerConfig = {
//   $profile:
// }

export type FollowTogglerModel = ReturnType<typeof createModel>;

export function createModel() {
  const toggled = createEvent<Profile>();
  const mutated = createEvent<Profile>();
  const failure = createEvent<unknown>();
  const settled = createEvent();

  const $$followProfile = followModel.createModel();
  const $$unfollowProfile = unfollowModel.createModel();

  sample({
    clock: [$$followProfile.follow, $$unfollowProfile.unfollow],
    target: toggled,
  });

  sample({
    clock: [
      $$followProfile.optimisticallyUpdate,
      $$unfollowProfile.optimisticallyUpdate,
    ],
    target: mutated,
  });

  sample({
    clock: [
      $$followProfile.followProfileMutation.finished.failure,
      $$unfollowProfile.unfollowProfileMutation.finished.failure,
    ],
    fn: ({ error }) => ({ error }),
    target: failure,
  });

  sample({
    clock: [
      $$followProfile.followProfileMutation.finished.finally,
      $$unfollowProfile.unfollowProfileMutation.finished.finally,
    ],
    target: settled,
  });

  return {
    $$followProfile,
    $$unfollowProfile,
    toggled,
    mutated,
    failure,
    settled,
  };
}

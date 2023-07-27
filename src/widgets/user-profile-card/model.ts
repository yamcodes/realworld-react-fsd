import { createEvent, sample, createStore, attach } from 'effector';
import { profileModel, profileApi } from '~entities/profile';
import { $$sessionModel } from '~entities/session';
import { followModel, unfollowModel } from '~features/profile';
import { createQuery } from '~shared/api/createQuery';
import { $ctx } from '~shared/ctx';

export type Access = {
  access: 'anonymous' | 'authorized' | 'authenticated';
  username: string | null;
};

export type UserProfileCardModel = Omit<ReturnType<typeof createModel>, 'load'>;

export function createModel() {
  const load = createEvent<string>();
  const unmounted = createEvent();

  const $$getProfileQuery = createQuery({
    fx: profileApi.getProfileFx,
    name: 'getProfileQuery',
  });

  const $auth = $$sessionModel.$visitor.map(Boolean);
  const $username = createStore<string>(null as never).on(
    load,
    (_, username) => username,
  );

  const $$profile = profileModel.createModel();
  const $$followProfile = followModel.createModel();
  const $$unfollowProfile = unfollowModel.createModel();

  sample({
    clock: load,
    target: [$$getProfileQuery.reset, $$profile.reset],
  });

  sample({
    clock: [
      load,
      $$followProfile.updateSettled,
      $$unfollowProfile.updateSettled,
    ],
    source: { username: $username, auth: $auth },
    fn: ({ username, auth }) => ({
      username,
      params: {
        cancelToken: 'getProfileQuery',
        secure: auth,
      },
    }),
    target: $$getProfileQuery.start,
  });

  sample({
    clock: [
      $$getProfileQuery.finished.success,
      $$followProfile.optimisticallyUpdate,
      $$followProfile.rollbackUpdate,
      $$unfollowProfile.optimisticallyUpdate,
      $$unfollowProfile.rollbackUpdate,
    ],
    target: $$profile.init,
  });

  sample({
    clock: $$getProfileQuery.finished.success,
    target: [$$followProfile.initialize, $$unfollowProfile.initialize],
  });

  sample({
    clock: unmounted,
    target: $$getProfileQuery.abort,
  });

  const followButtonClicked = createEvent();

  const navigateToLoginFx = attach({
    name: 'navigateToLoginFx',
    source: $ctx,
    effect: (ctx) => ctx.router.navigate('/login'),
  });

  sample({
    clock: followButtonClicked,
    target: navigateToLoginFx,
  });

  return {
    load,
    unmounted,
    followButtonClicked,
    $auth,
    $$profile,
    $response: $$getProfileQuery.$response,
    $$followProfile,
    $$unfollowProfile,
  };
}

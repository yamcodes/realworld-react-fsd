import {
  createEvent,
  sample,
  createStore,
  split,
  restore,
  attach,
} from 'effector';
import { profileApi } from '~entities/profile';
import { $$sessionModel } from '~entities/session';
import { createQuery } from '~shared/api/createQuery';
import { ProfileDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

export type FollowProfileModel = Omit<
  ReturnType<typeof createFollowProfileModel>,
  'initialize'
>;

function createFollowProfileModel() {
  const initialize = createEvent<ProfileDto | null>();
  const followed = createEvent();

  const $$followProfileQuery = createQuery({
    name: 'followProfileQuery',
    fx: profileApi.followProfileFx,
  });

  const $profile = restore(initialize, null)
    .on($$followProfileQuery.start, (profile) => ({
      ...profile!,
      following: true,
    }))
    .on($$followProfileQuery.finished.success, (_, profile) => profile)
    .reset($$followProfileQuery.finished.failure);

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: followed,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({
      username: profile.username,
      params: { cancelToken: 'getProfileQuery' },
    }),
    target: $$followProfileQuery.start,
  });

  return {
    initialize,
    $username,
    followed,
  };
}

export type UnfollowProfileModel = Omit<
  ReturnType<typeof createUnfollowProfileModel>,
  'initialize'
>;

function createUnfollowProfileModel() {
  const initialize = createEvent<ProfileDto | null>();
  const unfollowed = createEvent();

  const $$unfollowProfileQuery = createQuery({
    name: 'unfollowProfileQuery',
    fx: profileApi.unfollowProfileFx,
  });

  const $profile = restore(initialize, null)
    .on($$unfollowProfileQuery.start, (profile) => ({
      ...profile!,
      following: false,
    }))
    .on($$unfollowProfileQuery.finished.success, (_, profile) => profile)
    .reset($$unfollowProfileQuery.finished.failure);

  const $username = $profile.map((profile) => profile?.username);

  sample({
    clock: unfollowed,
    source: $profile,
    filter: Boolean,
    fn: (profile) => ({
      username: profile.username,
      params: { cancelToken: 'getProfileQuery' },
    }),
    target: $$unfollowProfileQuery.start,
  });

  return {
    initialize,
    $username,
    unfollowed,
  };
}

export type Access = {
  access: 'anonymous' | 'authorized' | 'authenticated';
  username: string | null;
};

export type ProfileCardModel = Omit<
  ReturnType<typeof createProfileCardModel>,
  'load'
>;

export function createProfileCardModel() {
  const load = createEvent<Access>();
  const unmounted = createEvent();

  const { loadVisitor, loadProfile } = split(load, {
    loadVisitor: (user) => user.access === 'authorized',
    loadProfile: (user) =>
      user.access === 'authenticated' || user.access === 'anonymous',
  });

  const $$getProfileQuery = createQuery({
    fx: profileApi.getProfileFx,
    name: 'getProfileQuery',
  });

  const $$followProfile = createFollowProfileModel();
  const $$unfollowProfile = createUnfollowProfileModel();

  const $profile = createStore<ProfileDto | null>(null).reset(load);
  const $user = restore(load, { access: 'anonymous', username: null });

  sample({
    clock: load,
    target: $$getProfileQuery.reset,
  });

  sample({
    clock: loadProfile,
    filter: ({ username }) => Boolean(username),
    fn: ({ username }) => ({
      username: username!,
      params: { cancelToken: 'getProfileQuery' },
    }),
    target: $$getProfileQuery.start,
  });

  sample({
    clock: $$getProfileQuery.finished.success,
    target: [
      $profile,
      $$followProfile.initialize,
      $$unfollowProfile.initialize,
    ],
  });

  sample({
    clock: unmounted,
    target: $$getProfileQuery.abort,
  });

  sample({
    // @ts-expect-error
    clock: loadVisitor,
    source: $$sessionModel.$visitor,
    target: [
      $profile,
      $$followProfile.initialize,
      $$unfollowProfile.initialize,
    ],
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

  const settingsButtonClicked = createEvent();

  const navigateToSettingsFx = attach({
    name: 'navigateToSettingsFx',
    source: $ctx,
    effect: (ctx) => ctx.router.navigate('/settings'),
  });

  sample({
    clock: settingsButtonClicked,
    target: navigateToSettingsFx,
  });

  return {
    load,
    unmounted,
    followButtonClicked,
    settingsButtonClicked,
    $user,
    $profile,
    $response: $$getProfileQuery.$response,
    $$followProfile,
    $$unfollowProfile,
  };
}

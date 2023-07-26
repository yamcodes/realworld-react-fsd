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
    target: $profile,
  });

  sample({
    clock: unmounted,
    target: $$getProfileQuery.abort,
  });

  sample({
    // @ts-expect-error
    clock: loadVisitor,
    source: $$sessionModel.$visitor,
    target: $profile,
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
    $user,
    $profile,
    $response: $$getProfileQuery.$response,
  };
}

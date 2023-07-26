import { combine, createEvent, restore, sample } from 'effector';
import { $$sessionModel } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { Access, createProfileCardModel } from '~widgets/profile-card';

const createProfilePageModel = () => {
  const routeOpened = createEvent<string | null>();
  const pageUnmounted = createEvent();

  const loaderFx = createLoaderEffect(async (args) => {
    routeOpened(args.params?.username || null);
    return null;
  });

  const $username = restore(routeOpened, null);
  const $user = combine(
    [$username, $$sessionModel.$visitor],
    ([username, visitor]): Access => {
      switch (true) {
        case !visitor:
          return { access: 'anonymous', username };

        case visitor && visitor.username === username:
          return { access: 'authorized', username };

        case visitor && visitor.username !== username:
          return { access: 'authenticated', username };

        default:
          throw new Error('Unexpected error');
      }
    },
  );

  const { load: loadProfileCard, ...$$profileCard } = createProfileCardModel();

  sample({
    clock: routeOpened,
    source: $user,
    target: loadProfileCard,
  });

  return {
    loaderFx,
    pageUnmounted,
    $$profileCard,
  };
};

export const { loaderFx, ...$$profilePage } = createProfilePageModel();

import { combine, createEvent, restore } from 'effector';
import { $$sessionModel } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { Access } from '~widgets/user-profile-card';

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

  return {
    loaderFx,
    pageUnmounted,
  };
};

export const { loaderFx, ...$$profilePage } = createProfilePageModel();

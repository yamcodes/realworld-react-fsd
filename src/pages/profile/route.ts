import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { loaderFx } from './model';

const ProfilePage = Loadable(
  lazy(() =>
    import('./ui').then((module) => ({ default: module.ProfilePage })),
  ),
);

const $$usernameRoute = createRoute(
  {
    path: 'profile/:username',
    element: createElement(ProfilePage),
  },
  { loaderFx },
);

const $$usernameFavoritesRoute = createRoute(
  {
    path: 'profile/:username/favorites',
    element: createElement(ProfilePage),
  },
  { loaderFx },
);

export const $$route = [$$usernameRoute, $$usernameFavoritesRoute];

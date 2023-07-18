import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { loaderFx } from './model';

const ProfilePage = Loadable(
  lazy(() =>
    import('./ProfilePage').then((module) => ({ default: module.ProfilePage })),
  ),
);

export const $$route = createRoute(
  {
    path: 'profile',
    children: [
      {
        path: ':username',
        element: createElement(ProfilePage),
      },
    ],
  },
  { loaderFx },
);

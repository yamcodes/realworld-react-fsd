import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { loaderFx } from './model';

const SettingsPage = Loadable(
  lazy(() =>
    import('./ui').then((module) => ({
      default: module.SettingsPage,
    })),
  ),
);

export const $$route = createRoute(
  {
    path: 'settings',
    element: createElement(SettingsPage),
  },
  {
    loaderFx,
  },
);

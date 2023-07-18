import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const SettingsPage = Loadable(
  lazy(() =>
    import('./SettingsPage').then((module) => ({
      default: module.SettingsPage,
    })),
  ),
);

export const $$route = createRoute({
  path: 'settings',
  element: createElement(SettingsPage),
});

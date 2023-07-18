import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const LoginPage = Loadable(
  lazy(() =>
    import('./LoginPage').then((module) => ({ default: module.LoginPage })),
  ),
);

export const $$route = createRoute({
  path: 'login',
  element: createElement(LoginPage),
});

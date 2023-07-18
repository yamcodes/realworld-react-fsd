import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const RegisterPage = Loadable(
  lazy(() =>
    import('./RegisterPage').then((module) => ({
      default: module.RegisterPage,
    })),
  ),
);

export const $$route = createRoute({
  path: 'register',
  element: createElement(RegisterPage),
});

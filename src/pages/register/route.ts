import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { loaderFx } from './model';

const RegisterPage = Loadable(
  lazy(() =>
    import('./ui').then((module) => ({
      default: module.RegisterPage,
    })),
  ),
);

export const $$route = createRoute(
  {
    path: 'register',
    element: createElement(RegisterPage),
  },
  {
    loaderFx,
  },
);

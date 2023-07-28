import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { loaderFx } from './model';

const HomePage = Loadable(
  lazy(() => import('./ui').then((module) => ({ default: module.HomePage }))),
);

export const $$route = createRoute(
  {
    path: '/',
    element: createElement(HomePage),
  },
  {
    loaderFx,
  },
);

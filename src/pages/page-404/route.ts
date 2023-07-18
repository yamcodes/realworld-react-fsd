import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const Page404 = Loadable(
  lazy(() =>
    import('./Page404').then((module) => ({ default: module.Page404 })),
  ),
);

export const $$route = createRoute({
  path: '404',
  element: createElement(Page404),
});

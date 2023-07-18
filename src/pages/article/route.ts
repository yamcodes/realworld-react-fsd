import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const ArticlePage = Loadable(
  lazy(() =>
    import('./ArticlePage').then((module) => ({ default: module.ArticlePage })),
  ),
);

export const $$route = createRoute({
  path: 'article',
  children: [
    {
      path: ':slug',
      element: createElement(ArticlePage),
    },
  ],
});

import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';

const EditorPage = Loadable(
  lazy(() =>
    import('./EditorPage').then((module) => ({ default: module.EditorPage })),
  ),
);

export const $$route = createRoute({
  path: 'editor',
  children: [
    {
      path: ':slug',
      element: createElement(EditorPage),
    },
  ],
});

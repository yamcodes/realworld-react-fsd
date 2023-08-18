import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { curArticleEditorLoaderFx, newArtilceEditorLoaderFx } from './model';

const EditorPage = Loadable(
  lazy(() => import('./ui').then((module) => ({ default: module.EditorPage }))),
);

const $$newArtilceEditorRoute = createRoute(
  {
    path: 'editor',
    element: createElement(EditorPage),
  },
  { loaderFx: newArtilceEditorLoaderFx },
);

const $$curArticleEditorRoute = createRoute(
  {
    path: 'editor/:slug',
    element: createElement(EditorPage),
  },
  { loaderFx: curArticleEditorLoaderFx },
);

export const $$route = [$$newArtilceEditorRoute, $$curArticleEditorRoute];

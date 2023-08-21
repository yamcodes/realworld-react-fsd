import { createElement, lazy } from 'react';
import { createRoute } from '~shared/lib/router';
import { Loadable } from '~shared/ui/loadable';
import { editArticleLoaderFx } from './model/editArticlePageModel';
import { newArticleLoaderFx } from './model/newArticlePageModel';

const NewArticlePage = Loadable(
  lazy(() =>
    import('./ui/new-article/ui').then((module) => ({
      default: module.NewArticlePage,
    })),
  ),
);

const EditArticlePage = Loadable(
  lazy(() =>
    import('./ui/edit-article/ui').then((module) => ({
      default: module.EditArticlePage,
    })),
  ),
);

const $$newArticleRoute = createRoute(
  {
    path: 'editor',
    element: createElement(NewArticlePage),
  },
  { loaderFx: newArticleLoaderFx },
);

const $$editArticleRoute = createRoute(
  {
    path: 'editor/:slug',
    element: createElement(EditArticlePage),
  },
  { loaderFx: editArticleLoaderFx },
);

export const $$route = [$$newArticleRoute, $$editArticleRoute];

import { createElement } from 'react';
import type { Router } from '@remix-run/router';
import { sample, createStore, createEffect, createEvent } from 'effector';
import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { $$articleRoute } from '~pages/article';
import { $$editorRoute } from '~pages/editor';
import { $$homeRoute } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { $$loginRoute } from '~pages/login';
import { $$page404Route } from '~pages/page-404';
import { $$profileRoute } from '~pages/profile';
import { $$registerRoute } from '~pages/register';
import { $$settingsRoute } from '~pages/settings';

const mainRouteModels = [
  // $$articleRoute,
  // $$editorRoute,
  $$homeRoute,
  $$loginRoute,
  // $$page404Route,
  ...$$profileRoute,
  $$registerRoute,
  $$settingsRoute,
];

export function createRouting() {
  const initialize = createEvent({ name: 'createRouting.initialize' });

  const $router = createStore<Router>(null as never);

  const setupRoutesFx = createEffect({
    name: 'setupRoutesFx',
    handler: async () =>
      Promise.all(mainRouteModels.map(($$route) => $$route.routeCreationFx())),
  });

  const setupRouterFx = createEffect({
    name: 'setupRouterFx',
    handler: (routes: RouteObject[]) =>
      createBrowserRouter([
        {
          element: createElement(MainLayout),
          children: routes,
        },
      ]),
  });

  sample({
    clock: initialize,
    target: setupRoutesFx,
  });

  sample({
    clock: setupRoutesFx.doneData,
    target: setupRouterFx,
  });

  sample({
    clock: setupRouterFx.doneData,
    target: $router,
  });

  return { initialize, $router };
}

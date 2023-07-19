import { createElement } from 'react';
import type { Router } from '@remix-run/router';
import {
  createEvent,
  sample,
  createStore,
  combine,
  createEffect,
  Event,
} from 'effector';
import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { $$articleRoute } from '~pages/article';
import { $$editorRoute } from '~pages/editor';
import { $$homeRoute } from '~pages/home';
import { MainLayout } from '~pages/layouts';
import { $$loginRoute } from '~pages/login';
import { $$page404Route } from '~pages/page-404';
import { $$profileRoute } from '~pages/profile';
import { $$registerRoute } from '~pages/register';
import { $ctx } from '~shared/ctx';
import { createTokenStorage } from '~shared/lib/token-storage';

export const initialize = createEvent();

const mainRouteModels = [
  $$articleRoute,
  $$editorRoute,
  $$homeRoute,
  $$loginRoute,
  $$page404Route,
  $$profileRoute,
  $$registerRoute,
];

type Routing = {
  initializeOn: Event<void>;
};

function createRouting(params: Routing) {
  const { initializeOn } = params;

  const $router = createStore<Router | null>(null);

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
    clock: initializeOn,
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

  return { $router };
}

const $$tokenStorage = createTokenStorage({
  initializeOn: initialize,
  tokenKey: 'testsession',
});

const $$routing = createRouting({
  initializeOn: initialize,
});

sample({
  // @ts-ignore
  source: {
    credentials: combine({
      clear: createStore($$tokenStorage.clearToken),
      update: createStore($$tokenStorage.updateToken),
      $token: $$tokenStorage.$token,
    }),
    router: $$routing.$router,
  },
  target: $ctx,
});

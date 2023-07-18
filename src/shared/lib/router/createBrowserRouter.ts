import { createElement } from 'react';
import { createStore, createEvent, createEffect, sample } from 'effector';
import { combineEvents } from 'patronum';
import {
  createBrowserRouter as createBrowserRouterRR,
  Outlet,
  RouteObject,
} from 'react-router-dom';
import { Route } from './createRoute';

export const createBrowserRouter = ($$routes: Route[]) => {
  const $router = createStore(
    createBrowserRouterRR([{ path: '*', element: null }]),
  );

  const initialize = createEvent();
  const routeInitializers = $$routes.map((route) => route.initialize);
  const $routes = $$routes.map((route) => route.$route);

  const instantiateFx = createEffect(async (routes: RouteObject[]) =>
    createBrowserRouterRR([
      {
        element: createElement(Outlet),
        children: routes,
      },
    ]),
  );

  $router.on(instantiateFx.doneData, (_, router) => router);

  sample({
    clock: initialize,
    target: routeInitializers,
  });

  sample({
    clock: combineEvents({
      events: routeInitializers,
    }),
    source: $routes,
    filter: (routes): routes is RouteObject[] => routes.every(Boolean),
    target: instantiateFx,
  });

  return { $router, initialize };
};

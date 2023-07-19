import { createEffect, scopeBind, Effect } from 'effector';
import {
  IndexRouteObject,
  NonIndexRouteObject,
  RouteObject,
} from 'react-router-dom';
import { LoaderRouterObjectEffect, ActionRouterObjectEffect } from './lib';

export type Route = {
  routeCreationFx: Effect<void, RouteObject, Error>;
};

export function createRoute(
  config:
    | Omit<IndexRouteObject, 'loader' | 'action'>
    | Omit<NonIndexRouteObject, 'loader' | 'action'>,
  effects: Partial<{
    loaderFx: LoaderRouterObjectEffect;
    actionFx: ActionRouterObjectEffect;
  }> = {},
): Route {
  const { loaderFx = createEffect(), actionFx = createEffect() } = effects;

  const routeCreationFx = createEffect<void, RouteObject>({
    name: 'routeCreationFx'.concat('.').concat(config.path!),
    handler: () => {
      const boundLoaderFx = scopeBind(loaderFx);
      const boundActionFx = scopeBind(actionFx);

      const route: RouteObject = {
        ...config,
        loader: async (params) => {
          if (!effects.loaderFx) return Promise.resolve(null);
          return boundLoaderFx(params);
        },
        action: async (params) => {
          if (!effects.actionFx) return Promise.resolve(null);
          return boundActionFx(params);
        },
      };
      return route;
    },
  });

  return { routeCreationFx };
}

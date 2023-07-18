import {
  Event,
  Store,
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector';
import {
  ActionFunction,
  IndexRouteObject,
  LoaderFunction,
  NonIndexRouteObject,
  RouteObject,
} from 'react-router-dom';

export const createLoaderEffect = (handler: LoaderFunction) =>
  createEffect(handler);

export const createActionEffect = (handler: ActionFunction) =>
  createEffect(handler);

export type LoaderRouterObjectEffect = ReturnType<typeof createLoaderEffect>;
export type ActionRouterObjectEffect = ReturnType<typeof createActionEffect>;

export type Route = {
  $route: Store<RouteObject | null>;
  initialize: Event<void>;
};

export const createRoute = (
  config:
    | Omit<IndexRouteObject, 'loader' | 'action'>
    | Omit<NonIndexRouteObject, 'loader' | 'action'>,
  effects: Partial<{
    loaderFx: LoaderRouterObjectEffect;
    actionFx: ActionRouterObjectEffect;
  }> = {},
): Route => {
  const $route = createStore<RouteObject | null>(null);
  const initialize = createEvent();

  const { loaderFx = createEffect(), actionFx = createEffect() } = effects;

  const routeCreationFx = createEffect<void, RouteObject>(() => {
    const loaderBound = scopeBind(loaderFx);
    const actionBound = scopeBind(actionFx);

    const route: RouteObject = {
      ...config,
      loader: (params) => {
        if (!effects.loaderFx) return null;
        return loaderBound(params);
      },
      action: (params) => {
        if (!effects.actionFx) return null;
        return actionBound(params);
      },
    };
    return route;
  });

  $route.on(routeCreationFx.doneData, (_, route) => route);

  sample({
    clock: initialize,
    target: routeCreationFx,
  });

  return { $route, initialize };
};

import { createEffect } from 'effector';
import { LoaderFunction, ActionFunction } from 'react-router-dom';

export const createLoaderEffect = (handler: LoaderFunction) =>
  createEffect(handler);

export const createActionEffect = (handler: ActionFunction) =>
  createEffect(handler);

export type LoaderRouterObjectEffect = ReturnType<typeof createLoaderEffect>;
export type ActionRouterObjectEffect = ReturnType<typeof createActionEffect>;

import { createEffect } from 'effector';
import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';

type LoaderFunction = {
  (args: LoaderFunctionArgs): Promise<Response | null> | Response | null;
};

type ActionFunction = {
  (args: ActionFunctionArgs): Promise<Response | null> | Response | null;
};

export const createLoaderEffect = (handler: LoaderFunction) =>
  createEffect(handler);

export const createActionEffect = (handler: ActionFunction) =>
  createEffect(handler);

export type LoaderRouterObjectEffect = ReturnType<typeof createLoaderEffect>;
export type ActionRouterObjectEffect = ReturnType<typeof createActionEffect>;

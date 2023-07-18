import { createEvent, sample } from 'effector';
import { $$articleRoute } from '~pages/article';
import { $$editorRoute } from '~pages/editor';
import { $$homeRoute } from '~pages/home';
import { $$loginRoute } from '~pages/login';
import { $$page404Route } from '~pages/page-404';
import { $$profileRoute } from '~pages/profile';
import { $$registerRoute } from '~pages/register';
import { $ctx } from '~shared/ctx';
import { createBrowserRouter } from '~shared/lib/router';

export const $$routing = createBrowserRouter([
  $$articleRoute,
  $$editorRoute,
  $$homeRoute,
  $$loginRoute,
  $$page404Route,
  $$profileRoute,
  $$registerRoute,
]);

export const initialize = createEvent();
const initializers = [$$routing.initialize];

sample({
  clock: initialize,
  target: initializers,
});

sample({
  source: { router: $$routing.$router },
  target: $ctx,
});

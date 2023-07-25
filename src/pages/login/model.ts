import { attach, createEvent, sample } from 'effector';
import { $$sessionModel } from '~entities/session';
import { $ctx } from '~shared/ctx';
import { createLoaderEffect } from '~shared/lib/router';
import { createLoginFormModel } from '~widgets/login-form';

const createLoginPageModel = () => {
  const routeOpened = createEvent();
  const pageUnmounted = createEvent();

  const toHomeFx = attach({
    source: $ctx,
    effect: (ctx) => ctx.router.navigate('/'),
  });

  const loaderFx = createLoaderEffect(async () => {
    if ($$sessionModel.$visitor) toHomeFx();
    routeOpened();
    return null;
  });

  const { initialize: initializeLoginForm, ...$$loginForm } =
    createLoginFormModel();

  sample({
    clock: routeOpened,
    target: initializeLoginForm,
  });

  return { loaderFx, pageUnmounted, $$loginForm };
};

export const { loaderFx, ...$$loginPage } = createLoginPageModel();

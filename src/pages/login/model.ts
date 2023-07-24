import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { createLoginFormModel } from '~widgets/login-form';

const createLoginPageModel = () => {
  const routeOpened = createEvent();
  const pageUnmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
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

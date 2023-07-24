import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { createRegisterFormModel } from '~widgets/register-form';

const createRegisterPageModel = () => {
  const routeOpened = createEvent();
  const pageUnmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    routeOpened();
    return null;
  });

  const { initialize: initializeRegisterForm, ...$$registerForm } =
    createRegisterFormModel();

  sample({
    clock: routeOpened,
    target: initializeRegisterForm,
  });

  return { loaderFx, pageUnmounted, $$registerForm };
};

export const { loaderFx, ...$$registerPage } = createRegisterPageModel();

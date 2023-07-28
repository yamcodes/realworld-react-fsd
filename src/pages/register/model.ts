import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { signupFormModel } from '~widgets/sign-up-form';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$signupForm = signupFormModel.createModel();

  sample({
    clock: opened,
    target: $$signupForm.init,
  });

  return { loaderFx, unmounted, $$signupForm };
};

export const { loaderFx, ...$$registerPage } = createModel();

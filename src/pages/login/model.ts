import { createEvent, sample } from 'effector';
import { $$sessionModel } from '~entities/session';
import { $ctx } from '~shared/ctx';
import { createLoaderEffect } from '~shared/lib/router';
import { signinFormModel } from '~widgets/sign-in-form';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  // const toHomeFx = attach({
  //   source: $ctx,
  //   effect: (ctx) => ctx.router.navigate('/'),
  // });

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$signinForm = signinFormModel.createModel();

  // sample({
  //   clock: opened,
  //   source: $$sessionModel.$visitor,
  //   filter: Boolean,
  //   target: toHomeFx,
  // });

  sample({
    clock: opened,
    target: $$signinForm.init,
  });

  return { loaderFx, unmounted, $$signinForm };
};

export const { loaderFx, ...$$loginPage } = createModel();

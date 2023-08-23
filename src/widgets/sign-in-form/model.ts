import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { sessionSigninModel } from '~features/session';
// import { $ctx } from '~shared/ctx';
import { createFormModel } from '~shared/lib/form';

export type SigninFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  // const toHomeFx = attach({
  //   source: $ctx,
  //   effect: (ctx) => ctx.router.navigate('/'),
  // });

  const $$signinForm = createFormModel({
    fields: {
      email: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      password: {
        initialValue: '',
        validationSchema: string().min(3),
      },
    },
  });

  const $$sessionSignIn = sessionSigninModel.createModel();

  sample({
    clock: init,
    target: $$signinForm.reset,
  });

  sample({
    clock: submitted,
    target: $$signinForm.validate,
  });

  sample({
    clock: $$signinForm.validated.success,
    source: $$signinForm.$form,
    target: $$sessionSignIn.signin,
  });

  // sample({
  //   clock: $$sessionModel.update,
  //   target: toHomeFx,
  // });

  // sample({
  //   clock: unmounted,
  //   target: $$sessionSignIn.abort,
  // });

  return {
    init,
    submitted,
    unmounted,
    fields: $$signinForm.fields,
    $$sessionSignIn,
  };
}

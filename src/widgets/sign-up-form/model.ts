import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { sessionSignupModel } from '~features/session';
import { createFormModel } from '~shared/lib/form';

export type SignupFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  // const toHomeFx = attach({
  //   source: $ctx,
  //   effect: (ctx) => ctx.router.navigate('/'),
  // });

  const $$signupForm = createFormModel({
    fields: {
      username: {
        initialValue: '',
        validationSchema: string().min(3),
      },
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

  const $$sessionSignUp = sessionSignupModel.createModel();

  sample({
    clock: init,
    target: $$signupForm.reset,
  });

  sample({
    clock: submitted,
    target: $$signupForm.validate,
  });

  sample({
    clock: $$signupForm.validated.success,
    source: $$signupForm.$form,
    target: $$sessionSignUp.signup,
  });

  // sample({
  //   clock: $$sessionModel.update,
  //   target: toHomeFx,
  // });

  // sample({
  //   clock: unmounted,
  //   target: $$sessionSignUp.abort,
  // });

  return {
    init,
    submitted,
    unmounted,
    fields: $$signupForm.fields,
    $$sessionSignUp,
  };
}

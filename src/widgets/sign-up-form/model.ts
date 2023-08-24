import { isInvalidDataError } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { string } from 'zod';
import { sessionSignupModel } from '~features/session';
import { createFormModel } from '~shared/lib/form';
import { toHomeFx } from '~shared/lib/router';

export type SignupFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

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

  const $error = createStore<string | null>(null)
    .on($$sessionSignUp.failure, (_, data) => {
      if (isInvalidDataError(data)) return data.error.explanation;
      return (data.error as Error).message;
    })
    .reset(init);

  sample({
    clock: $$sessionSignUp.success,
    target: toHomeFx,
  });

  return {
    init,
    submitted,
    unmounted,
    $error,
    fields: $$signupForm.fields,
    $$sessionSignUp,
  };
}

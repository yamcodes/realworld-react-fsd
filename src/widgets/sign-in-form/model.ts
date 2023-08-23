import { isInvalidDataError } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { string } from 'zod';
import { $$sessionModel } from '~entities/session';
import { sessionSigninModel } from '~features/session';
import { createFormModel } from '~shared/lib/form';
import { toHomeFx } from '~shared/lib/router';

export type SigninFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

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

  const $error = createStore<string | null>(null)
    .on($$sessionSignIn.failure, (_, data) => {
      if (isInvalidDataError(data)) return data.error.explanation;
      return (data.error as Error).message;
    })
    .reset(init);

  sample({
    clock: $$sessionModel.update,
    target: toHomeFx,
  });

  // sample({
  //   clock: unmounted,
  //   target: $$sessionSignIn.abort,
  // });

  return {
    init,
    submitted,
    unmounted,
    $error,
    fields: $$signinForm.fields,
    $$sessionSignIn,
  };
}

import { attach, createEvent, sample } from 'effector';
import { string } from 'zod';
import { createNewUserModel } from '~features/session';
import { $ctx } from '~shared/ctx';
import { createFormModel } from '~shared/lib/form';

export type RegisterFormModel = Omit<
  ReturnType<typeof createRegisterFormModel>,
  'initialize'
>;

export function createRegisterFormModel() {
  const initialize = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const toHomeFx = attach({
    source: $ctx,
    effect: (ctx) => ctx.router.navigate('/'),
  });

  const $$registerForm = createFormModel({
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

  const $$newUser = createNewUserModel({
    $newUser: $$registerForm.$form,
  });

  sample({
    clock: submitted,
    target: $$registerForm.validateFx,
  });

  sample({
    clock: $$registerForm.validateFx.doneData,
    filter: (errors) => !errors,
    target: $$newUser.createUserFx,
  });

  sample({
    clock: $$newUser.createUserFx.done,
    target: toHomeFx,
  });

  sample({
    clock: unmounted,
    target: [$$newUser.abort, $$registerForm.reset, $$newUser.reset],
  });

  return {
    initialize,
    submitted,
    unmounted,
    fields: $$registerForm.fields,
    $response: $$newUser.$response,
  };
}

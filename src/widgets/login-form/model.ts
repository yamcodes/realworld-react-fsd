import { attach, createEvent, sample } from 'effector';
import { string } from 'zod';
import { createLoginUserModel } from '~features/session';
import { $ctx } from '~shared/ctx';
import { createFormModel } from '~shared/lib/form';

export type LoginFormModel = Omit<
  ReturnType<typeof createLoginFormModel>,
  'initialize'
>;

export function createLoginFormModel() {
  const initialize = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const toHomeFx = attach({
    source: $ctx,
    effect: (ctx) => ctx.router.navigate('/'),
  });

  const $$loginForm = createFormModel({
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

  const $$loginUser = createLoginUserModel({ $loginUser: $$loginForm.$form });

  sample({
    clock: initialize,
    target: [$$loginForm.reset, $$loginUser.reset],
  });

  sample({
    clock: submitted,
    target: $$loginForm.validateFx,
  });

  sample({
    clock: $$loginForm.validateFx.doneData,
    filter: (errors) => !errors,
    target: $$loginUser.loginUserFx,
  });

  sample({
    clock: $$loginUser.loginUserFx.done,
    target: toHomeFx,
  });

  sample({
    clock: unmounted,
    target: $$loginUser.abort,
  });

  return {
    initialize,
    submitted,
    unmounted,
    fields: $$loginForm.fields,
    $response: $$loginUser.$response,
  };
}

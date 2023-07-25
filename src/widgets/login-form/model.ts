import { attach, createEvent, sample } from 'effector';
import { string } from 'zod';
import { $$sessionModel, sessionApi } from '~entities/session';
import { createQuery } from '~shared/api/createQuery';
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

  const $$loginUserQuery = createQuery({
    fx: sessionApi.loginUserFx,
    name: 'loginUserQuery',
  });

  sample({
    clock: initialize,
    target: [$$loginUserQuery.reset, $$loginForm.reset],
  });

  sample({
    clock: submitted,
    target: $$loginForm.validate,
  });

  sample({
    clock: $$loginForm.validated.success,
    source: $$loginForm.$form,
    fn: (user) => ({ user, params: { cancelToken: 'loginUserQuery' } }),
    target: $$loginUserQuery.start,
  });

  sample({
    clock: $$loginUserQuery.finished.success,
    target: $$sessionModel.update,
  });

  sample({
    clock: $$sessionModel.update,
    target: toHomeFx,
  });

  sample({
    clock: unmounted,
    target: $$loginUserQuery.abort,
  });

  return {
    initialize,
    submitted,
    unmounted,
    fields: $$loginForm.fields,
    $response: $$loginUserQuery.$response,
  };
}

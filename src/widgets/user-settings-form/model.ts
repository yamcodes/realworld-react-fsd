import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { $$sessionModel, sessionApi } from '~entities/session';
import { createQuery } from '~shared/api/createQuery';
import { createFormModel } from '~shared/lib/form';

export type UserSettingsFormModel = Omit<
  ReturnType<typeof createUserSettingsFormModel>,
  'initialize'
>;

export function createUserSettingsFormModel() {
  const initialize = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const $$settingsForm = createFormModel({
    fields: {
      image: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      username: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      bio: {
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

  const $$updateUserQuery = createQuery({
    fx: sessionApi.updateUserFx,
    name: 'updateUserQuery',
  });

  sample({
    clock: initialize,
    target: [$$updateUserQuery.reset, $$settingsForm.reset],
  });

  sample({
    clock: submitted,
    target: $$settingsForm.validate,
  });

  sample({
    clock: $$settingsForm.validated.success,
    source: $$settingsForm.$form,
    fn: (user) => ({ user, params: { cancelToken: 'updateUserQuery' } }),
    target: $$updateUserQuery.start,
  });

  sample({
    clock: $$updateUserQuery.finished.success,
    target: $$sessionModel.update,
  });

  sample({
    clock: unmounted,
    target: $$updateUserQuery.abort,
  });

  return {
    initialize,
    submitted,
    unmounted,
    fields: $$settingsForm.fields,
    $response: $$updateUserQuery.$response,
  };
}

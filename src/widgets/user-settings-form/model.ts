import { isInvalidDataError } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { string } from 'zod';
import { $$sessionModel } from '~entities/session';
import { sessionUpdateModel } from '~features/session';
import { createFormModel } from '~shared/lib/form';
import { toProfileFx } from '~shared/lib/router';

export type UserSettingsFormModel = Omit<
  ReturnType<typeof createModel>,
  'init'
>;

export function createModel() {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const $$userSettingsForm = createFormModel({
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

  const $$sessionUpdate = sessionUpdateModel.createModel();

  sample({
    clock: init,
    target: $$userSettingsForm.reset,
  });

  sample({
    clock: init,
    source: $$sessionModel.$visitor,
    filter: Boolean,
    fn: ({ image, username, bio, email }) => ({ image, username, bio, email }),
    target: $$userSettingsForm.setForm,
  });

  sample({
    clock: submitted,
    target: $$userSettingsForm.validate,
  });

  sample({
    clock: $$userSettingsForm.validated.success,
    source: $$userSettingsForm.$form,
    target: $$sessionUpdate.update,
  });

  const $error = createStore<string | null>(null)
    .on($$sessionUpdate.failure, (_, data) => {
      if (isInvalidDataError(data)) return data.error.explanation;
      return (data.error as Error).message;
    })
    .reset(init);

  sample({
    clock: $$sessionUpdate.success,
    fn: ({ result: visitor }) => visitor.username,
    target: toProfileFx,
  });

  return {
    init,
    submitted,
    unmounted,
    $error,
    fields: $$userSettingsForm.fields,
    $$sessionUpdate,
  };
}

import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { sessionUpdateModel } from '~features/session';
import { createFormModel } from '~shared/lib/form';

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
    clock: submitted,
    target: $$userSettingsForm.validate,
  });

  sample({
    clock: $$userSettingsForm.validated.success,
    source: $$userSettingsForm.$form,
    target: $$sessionUpdate.update,
  });

  // sample({
  //   clock: $$sessionModel.update,
  //   target: toHomeFx,
  // });

  // sample({
  //   clock: unmounted,
  //   target: $$sessionUpdate.abort,
  // });

  return {
    init,
    submitted,
    unmounted,
    fields: $$userSettingsForm.fields,
    $$sessionUpdate,
  };
}

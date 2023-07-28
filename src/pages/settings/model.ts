import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { userSettingsFormModel } from '~widgets/user-settings-form';

function createModel() {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$userSettingsForm = userSettingsFormModel.createModel();

  sample({
    clock: opened,
    target: $$userSettingsForm.init,
  });

  return { loaderFx, unmounted, $$userSettingsForm };
}

export const { loaderFx, ...$$settingsPage } = createModel();

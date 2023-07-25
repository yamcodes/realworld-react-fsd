import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { createUserSettingsFormModel } from '~widgets/user-settings-form';

function createSettingsPageModel() {
  const routeOpened = createEvent();
  const pageUnmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    routeOpened();
    return null;
  });

  const { initialize: initializeSettingsForm, ...$$settingsForm } =
    createUserSettingsFormModel();

  sample({
    clock: routeOpened,
    target: initializeSettingsForm,
  });

  return { loaderFx, pageUnmounted, $$settingsForm };
}

export const { loaderFx, ...$$settingsPage } = createSettingsPageModel();

import { attach, createEvent, sample } from 'effector';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { $$sessionModel } from '~entities/session';
import { sessionSignoutModel } from '~features/session';
import { PATH_PAGE, toHomeFx } from '~shared/lib/router';
import { userSettingsFormModel } from '~widgets/user-settings-form';

function createModel() {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor, _args: LoaderFunctionArgs) => {
      if (!visitor) return redirect(PATH_PAGE.root);
      opened();
      return null;
    },
  });

  const $$userSettingsForm = userSettingsFormModel.createModel();

  sample({
    clock: opened,
    target: $$userSettingsForm.init,
  });

  const $$sessionSignout = sessionSignoutModel.createModel();

  sample({
    clock: $$sessionSignout.signout,
    target: toHomeFx,
  });

  return { loaderFx, unmounted, $$userSettingsForm, $$sessionSignout };
}

export const { loaderFx, ...$$settingsPage } = createModel();

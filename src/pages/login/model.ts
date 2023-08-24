import { attach, createEvent, sample } from 'effector';
import { redirect } from 'react-router-dom';
import { $$sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/router';
import { signinFormModel } from '~widgets/sign-in-form';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor) => {
      if (visitor) return redirect(PATH_PAGE.root);
      opened();
      return null;
    },
  });

  const $$signinForm = signinFormModel.createModel();

  sample({
    clock: opened,
    target: $$signinForm.init,
  });

  return { loaderFx, unmounted, $$signinForm };
};

export const { loaderFx, ...$$loginPage } = createModel();

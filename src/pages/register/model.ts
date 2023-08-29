import { attach, createEvent, sample } from 'effector';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { $$sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/router';
import { signupFormModel } from '~widgets/sign-up-form';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor, _args: LoaderFunctionArgs) => {
      if (visitor) return redirect(PATH_PAGE.root);
      opened();
      return null;
    },
  });

  const $$signupForm = signupFormModel.createModel();

  sample({
    clock: opened,
    target: $$signupForm.init,
  });

  return { loaderFx, unmounted, $$signupForm };
};

export const { loaderFx, ...$$registerPage } = createModel();

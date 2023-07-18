import { createLoaderEffect } from '~shared/lib/router';
import { sessionModel } from '~shared/session';

const createModel = () => {
  const loaderFx = createLoaderEffect(async () => {
    await sessionModel.checkAuthFx();
    return null;
  });
  return { loaderFx };
};

export const { loaderFx } = createModel();

import { createLoaderEffect } from '~shared/lib/router';

const createModel = () => {
  const loaderFx = createLoaderEffect(async () => null);

  return { loaderFx };
};

export const { loaderFx } = createModel();

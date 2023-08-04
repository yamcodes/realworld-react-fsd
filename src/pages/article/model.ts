import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { articleModel } from '~widgets/article';

const createModel = () => {
  const opened = createEvent<string>();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async (args) => {
    const slug = args.params!.slug!;
    opened(slug);
    return null;
  });

  const $$article = articleModel.createModel();

  sample({
    clock: opened,
    target: $$article.init,
  });

  return {
    loaderFx,
    unmounted,
    $$article,
  };
};

export const { loaderFx, ...$$articlePage } = createModel();

import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { popularTagsModel } from '~widgets/popular-tags';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$popularTags = popularTagsModel.createModel();

  sample({
    clock: opened,
    target: [$$popularTags.init],
  });

  return { loaderFx, unmounted, $$popularTags };
};

export const { loaderFx, ...$$homePage } = createModel();

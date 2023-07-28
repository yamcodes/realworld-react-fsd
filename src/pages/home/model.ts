import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { popularTagsModel } from '~widgets/popular-tags';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$popularTags = popularTagsModel.createModel();
  const $$mainArticleList = mainArticleListModel.createModel();

  sample({
    clock: opened,
    target: [$$popularTags.init, $$mainArticleList.init],
  });

  return { loaderFx, unmounted, $$popularTags, $$mainArticleList };
};

export const { loaderFx, ...$$homePage } = createModel();

import { createEvent, createStore, sample } from 'effector';
import { articleModel } from '~entities/article';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { popularTagsModel } from '~widgets/popular-tags';
import { userArticleListModel } from '~widgets/user-article-list';

export type HomePageModel = Omit<ReturnType<typeof createModel>, 'loaderFx'>;

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();
  const userFeedClicked = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $$filterModel = articleModel.createFilterModel();

  const $userFeed = createStore(false)
    .on(userFeedClicked, () => true)
    .on($$filterModel.filterChanged, () => false)
    .reset(opened);

  sample({
    clock: opened,
    target: $$filterModel.init,
  });

  const $$userArticleList = userArticleListModel.createModel();

  sample({
    clock: userFeedClicked,
    target: $$userArticleList.init,
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $filterQuery: $$filterModel.$query,
  });

  sample({
    clock: [opened, $$filterModel.filterChanged],
    target: $$mainArticleList.init,
  });

  const $$popularTags = popularTagsModel.createModel();

  sample({
    clock: opened,
    target: [$$popularTags.init],
  });

  sample({
    clock: $$popularTags.tagClicked,
    target: $$filterModel.filterBy.tag,
  });

  return {
    loaderFx,
    unmounted,
    userFeedClicked,
    $userFeed,
    $$filterModel,
    $$userArticleList,
    $$mainArticleList,
    $$popularTags,
  };
};

export const { loaderFx, ...$$homePage } = createModel();

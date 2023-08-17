import { createEvent, sample, createStore, createApi } from 'effector';
import { articleModel } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { popularTagsModel } from '~widgets/popular-tags';
import { userArticleListModel } from '~widgets/user-article-list';

type Tab = {
  userFeed?: boolean;
  globalFeed?: boolean;
  tagFeed?: string;
};

export type HomePageModel = Omit<ReturnType<typeof createModel>, 'loaderFx'>;

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $activeTab = createStore<Tab>({ globalFeed: true }).reset(opened);

  const tab = createApi($activeTab, {
    userFeed: () => ({ userFeed: true }),
    globalFeed: () => ({ globalFeed: true }),
    tagFeed: (_, tag: string) => ({ tagFeed: tag }),
  });

  const $$popularTags = popularTagsModel.createModel();

  sample({
    clock: opened,
    target: $$popularTags.init,
  });

  const $$filterModel = articleModel.createFilterModel();

  sample({
    clock: opened,
    target: $$filterModel.init,
  });

  sample({
    clock: tab.userFeed,
    source: $$sessionModel.$visitor,
    filter: Boolean,
    fn: ({ username }) => username,
    target: $$filterModel.filterBy.author,
  });

  sample({
    clock: tab.globalFeed,
    target: $$filterModel.filterBy.all,
  });

  sample({
    clock: $$popularTags.tagClicked,
    target: [$$filterModel.filterBy.tag, tab.tagFeed],
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $filterQuery: $$filterModel.$query,
  });

  sample({
    clock: [opened, tab.globalFeed, tab.tagFeed],
    target: $$mainArticleList.init,
  });

  const $$userArticleList = userArticleListModel.createModel();

  sample({
    clock: tab.userFeed,
    target: $$userArticleList.init,
  });

  return {
    loaderFx,
    unmounted,
    tab,
    $activeTab,
    $$filterModel,
    $$userArticleList,
    $$mainArticleList,
    $$popularTags,
  };
};

export const { loaderFx, ...$$homePage } = createModel();

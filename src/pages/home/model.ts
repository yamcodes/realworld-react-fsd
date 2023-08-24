import { createEvent, sample, createStore, createApi } from 'effector';
import { articleModel } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { popularTagsModel } from '~widgets/popular-tags';
import { userArticleListModel } from '~widgets/user-article-list';

export type Tab = 'all' | 'author' | 'tag';

export type HomePageModel = Omit<ReturnType<typeof createModel>, 'loaderFx'>;

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  const $tab = createStore<Tab>('all').reset(opened);

  const tabApi = createApi($tab, {
    all: () => 'all',
    author: () => 'author',
    tag: () => 'tag',
  });

  const $$popularTags = popularTagsModel.createModel();
  const $tag = createStore<string | null>(null)
    .on($$popularTags.tagClicked, (_, tag) => tag)
    .reset(opened);

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
    clock: tabApi.author,
    source: $$sessionModel.$visitor,
    filter: Boolean,
    fn: ({ username }) => username,
    target: $$filterModel.filterBy.author,
  });

  sample({
    clock: tabApi.all,
    target: $$filterModel.filterBy.all,
  });

  sample({
    clock: $$popularTags.tagClicked,
    target: [$$filterModel.filterBy.tag, tabApi.tag],
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $filterQuery: $$filterModel.$query,
  });

  sample({
    clock: [opened, tabApi.all, tabApi.tag],
    target: $$mainArticleList.init,
  });

  const $$userArticleList = userArticleListModel.createModel();

  sample({
    clock: tabApi.author,
    target: $$userArticleList.init,
  });

  return {
    loaderFx,
    unmounted,
    tabApi,
    $tab,
    $tag,
    $$filterModel,
    $$userArticleList,
    $$mainArticleList,
    $$popularTags,
  };
};

export const { loaderFx, ...$$homePage } = createModel();

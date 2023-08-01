import { createQuery } from '@farfetched/core';
import {
  Store,
  combine,
  createApi,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { equals, and, not } from 'patronum';
import { Article, Query, articleApi } from '~entities/article';

export type MainArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const unmounted = createEvent();

  const fetchInitial = createEvent();
  const fetchNextPage = createEvent();

  const $$pagination = createPaginationModel();
  const $$filterQuery = createFilterQueryModel();

  const $query = combine(
    $$pagination.$pageQuery,
    $$filterQuery.$query,
    (pageQuery, filter) => ({
      query: { ...pageQuery, ...filter },
    }),
  );

  const articlesQuery = createQuery({
    handler: articleApi.getArticlesFx,
    name: 'articlesQuery',
  });

  const $pendingInitial = createStore(false)
    .on(fetchInitial, () => true)
    .on(articlesQuery.finished.finally, () => false);

  const $pendingNextPage = createStore(false)
    .on(fetchNextPage, () => true)
    .on(articlesQuery.finished.finally, () => false);

  const $articles = createStore<Array<Article>>([])
    .on(articlesQuery.finished.success, (prevArticles, data) => [
      ...prevArticles,
      ...data.result.articles,
    ])
    .reset(init);

  const $articlesCount = createStore<number | null>(null)
    .on(articlesQuery.finished.success, (_, data) => data.result.articlesCount)
    .reset(init);

  const $articlesReceived = $articles.map((articles) => articles.length);

  const $emptyData = and(articlesQuery.$succeeded, not($articlesReceived));
  const $hasNextPage = not(equals($articlesCount, $articlesReceived));
  const $canFetchMore = and(not($pendingInitial), $hasNextPage);

  sample({
    clock: init,
    source: $query,
    target: [$$pagination.reset, articlesQuery.start, fetchInitial],
  });

  sample({
    clock: $$filterQuery.filterChanged,
    target: init,
  });

  sample({
    clock: $$pagination.nextPage,
    source: $query,
    target: [articlesQuery.start, fetchNextPage],
  });

  return {
    init,
    unmounted,
    $articles,
    $pendingInitial,
    $pendingNextPage,
    $error: articlesQuery.$error,
    $emptyData,
    $canFetchMore,
    $$pagination,
    $$filterQuery,
  };
}

type PaginationQuery = Required<Pick<Query, 'limit' | 'offset'>>;

type PaginationConfig = {
  initialPage?: number;
  pageSize?: number;
  step?: number;
};

const defaultConfig = { initialPage: 1, pageSize: 10, step: 1 };

function createPaginationModel(config?: PaginationConfig) {
  const paginationConfig = {
    ...defaultConfig,
    ...config,
  };

  const { initialPage, pageSize, step } = paginationConfig;

  const reset = createEvent();
  const nextPage = createEvent();

  const $page = createStore(initialPage).reset(reset);
  const $pageSize = createStore(pageSize).reset(reset);
  const $step = createStore(step).reset(reset);

  const $offset = combine($page, $pageSize, (page, size) => (page - 1) * size);

  const $pageQuery: Store<PaginationQuery> = combine(
    $offset,
    $pageSize,
    (offset, limit) => ({
      offset,
      limit,
    }),
  );

  sample({
    clock: nextPage,
    source: { page: $page, step: $step },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    fn: ({ page, step }) => page + step,
    target: $page,
  });

  return {
    reset,
    nextPage,
    $pageQuery,
  };
}

type FilterQuery = Pick<Query, 'author' | 'favorited' | 'tag'>;

function createFilterQueryModel() {
  const reset = createEvent();
  const filterChanged = createEvent();

  const $query = createStore<FilterQuery>({}).reset(reset);

  const filterBy = createApi($query, {
    all: () => ({}),
    tag: (_, tag: string) => ({ tag }),
    author: (_, author: string) => ({ author }),
    authorFavorites: (_, favorited: string) => ({ favorited }),
  });

  sample({
    clock: $query,
    target: filterChanged,
  });

  return { reset, filterChanged, filterBy, $query };
}

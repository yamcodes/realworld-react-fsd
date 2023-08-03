import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample, combine } from 'effector';
import { equals, and, not } from 'patronum';
import { Article, articleApi, articleModel } from '~entities/article';

export type MainArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

type MainArticleListConfgi = {
  $filterQuery: articleModel.FilterStore;
};

export function createModel(config: MainArticleListConfgi) {
  const { $filterQuery } = config;

  const init = createEvent();
  const reset = createEvent();
  const unmounted = createEvent();

  const fetchInitial = createEvent();

  const articlesQuery = createQuery({
    handler: articleApi.getArticlesFx,
    name: 'articlesQuery',
  });

  const $$pagination = articleModel.createPaginationModel();

  const $query = combine(
    $$pagination.$query,
    $filterQuery,
    (pageQuery, filterQuery) => ({
      query: { ...pageQuery, ...filterQuery },
    }),
  );

  const $pendingInitial = createStore(false)
    .on(fetchInitial, () => true)
    .on(articlesQuery.finished.finally, () => false);

  const $pendingNextPage = createStore(false)
    .on($$pagination.nextPage, () => true)
    .on(articlesQuery.finished.finally, () => false);

  const $articles = createStore<Array<Article>>([])
    .on(articlesQuery.finished.success, (prevArticles, data) => [
      ...prevArticles,
      ...data.result.articles,
    ])
    .reset(reset);

  const $articlesCount = createStore<number | null>(null)
    .on(articlesQuery.finished.success, (_, data) => data.result.articlesCount)
    .reset(reset);

  const $articlesReceived = $articles.map((articles) => articles.length);

  const $emptyData = and(articlesQuery.$succeeded, not($articlesReceived));
  const $hasNextPage = not(equals($articlesCount, $articlesReceived));
  const $canFetchMore = and(not($pendingInitial), $hasNextPage);

  sample({
    clock: init,
    source: $query,
    target: [reset, articlesQuery.start, fetchInitial],
  });

  sample({
    clock: $$pagination.nextPage,
    source: $query,
    target: articlesQuery.start,
  });

  sample({
    clock: reset,
    target: [$$pagination.reset, articlesQuery.reset],
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
  };
}

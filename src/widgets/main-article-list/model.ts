/* eslint-disable @typescript-eslint/no-shadow */
import { createQuery } from '@farfetched/core';
import { Store, createEvent, createStore, sample, Event } from 'effector';
import { equals, and, not } from 'patronum';
import { Article, Query, articleApi } from '~entities/article';

export type MainArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

type MainArticleListConfgi = {
  $query: Store<{ query: Query }>;
  loadNextPageOn: Event<void>;
  testOn: Event<void>;
};

export function createModel(config: MainArticleListConfgi) {
  const { $query, loadNextPageOn, testOn } = config;

  const init = createEvent();
  const unmounted = createEvent();

  const fetchInitial = createEvent();

  const articlesQuery = createQuery({
    handler: articleApi.getArticlesFx,
    name: 'articlesQuery',
  });

  const $pendingInitial = createStore(false)
    .on(fetchInitial, () => true)
    .on(articlesQuery.finished.finally, () => false);

  const $pendingNextPage = createStore(false)
    .on(loadNextPageOn, () => true)
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
    target: [articlesQuery.start, fetchInitial],
  });

  sample({
    clock: testOn,
    target: init,
  });

  sample({
    clock: loadNextPageOn,
    source: $query,
    target: articlesQuery.start,
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
  };
}

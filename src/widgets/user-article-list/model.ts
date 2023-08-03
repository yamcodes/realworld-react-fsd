import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { equals, and, not } from 'patronum';
import { Article, articleApi, articleModel } from '~entities/article';

export type UserArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const reset = createEvent();
  const unmounted = createEvent();

  const fetchInitial = createEvent();

  const articlesFeedQuery = createQuery({
    handler: articleApi.getArticlesFeedFx,
    name: 'articlesFeedQuery',
  });

  const $$pagination = articleModel.createPaginationModel();

  const $query = $$pagination.$query.map((query) => ({ query }));

  const $pendingInitial = createStore(false)
    .on(fetchInitial, () => true)
    .on(articlesFeedQuery.finished.finally, () => false);

  const $pendingNextPage = createStore(false)
    .on($$pagination.nextPage, () => true)
    .on(articlesFeedQuery.finished.finally, () => false);

  const $articles = createStore<Array<Article>>([])
    .on(articlesFeedQuery.finished.success, (prevArticles, data) => [
      ...prevArticles,
      ...data.result.articles,
    ])
    .reset(reset);

  const $articlesCount = createStore<number | null>(null)
    .on(
      articlesFeedQuery.finished.success,
      (_, data) => data.result.articlesCount,
    )
    .reset(reset);

  const $articlesReceived = $articles.map((articles) => articles.length);

  const $emptyData = and(articlesFeedQuery.$succeeded, not($articlesReceived));
  const $hasNextPage = not(equals($articlesCount, $articlesReceived));
  const $canFetchMore = and(not($pendingInitial), $hasNextPage);

  sample({
    clock: init,
    source: $query,
    target: [reset, articlesFeedQuery.start, fetchInitial],
  });

  sample({
    clock: $$pagination.nextPage,
    source: $query,
    target: articlesFeedQuery.start,
  });

  sample({
    clock: reset,
    target: [$$pagination.reset, articlesFeedQuery.reset],
  });

  return {
    init,
    unmounted,
    $articles,
    $pendingInitial,
    $pendingNextPage,
    $error: articlesFeedQuery.$error,
    $emptyData,
    $canFetchMore,
    $$pagination,
  };
}

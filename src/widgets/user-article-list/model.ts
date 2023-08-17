import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { equals, and, not } from 'patronum';
import { Article, articleApi, articleModel } from '~entities/article';
import { favoriteModel, unfavoriteModel } from '~features/article';

export type UserArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const update = createEvent();
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

  const { $error } = articlesFeedQuery;

  const $data = createStore<{
    articles: Article[];
    articlesCount: number;
  }>({ articles: [], articlesCount: 0 }).reset(reset);

  const $articles = $data.map((data) => data.articles);
  const $articlesCount = $data.map((data) => data.articlesCount);
  const $articlesReceived = $data.map((data) => data.articles.length);

  const $emptyData = and(articlesFeedQuery.$succeeded, not($articlesReceived));
  const $hasNextPage = not(equals($articlesCount, $articlesReceived));
  const $canFetchMore = and(not($pendingInitial), $hasNextPage);

  sample({
    clock: init,
    target: reset,
  });

  sample({
    clock: reset,
    target: [$$pagination.reset, articlesFeedQuery.reset],
  });

  sample({
    clock: init,
    source: $query,
    target: [articlesFeedQuery.start, fetchInitial],
  });

  sample({
    clock: update,
    source: $query,
    target: articlesFeedQuery.start,
  });

  sample({
    clock: $$pagination.nextPage,
    source: $query,
    target: articlesFeedQuery.start,
  });

  sample({
    clock: articlesFeedQuery.finished.success,
    source: {
      prevData: $data,
      curData: articlesFeedQuery.$data,
    },
    fn: ({ prevData, curData }) => ({
      articles: [...prevData.articles, ...(curData?.articles || [])],
      articlesCount: curData?.articlesCount || 0,
    }),
    target: $data,
  });

  const $$favoriteArticle = favoriteModel.createModel();
  const $$unfavoriteArticle = unfavoriteModel.createModel();

  const $mutatedArticle = createStore<Article | null>(null).on(
    [$$favoriteArticle.mutated, $$unfavoriteArticle.mutated],
    (_, article) => article,
  );

  sample({
    clock: [$$favoriteArticle.mutated, $$unfavoriteArticle.mutated],
    source: {
      data: $data,
      mutatedArticle: $mutatedArticle,
    },
    fn: ({ data, mutatedArticle }) => ({
      articles: data.articles.map((article) =>
        article.slug === mutatedArticle?.slug ? mutatedArticle : article,
      ),
      articlesCount: data.articlesCount,
    }),
    target: $data,
  });

  sample({
    clock: [$$favoriteArticle.failure, $$unfavoriteArticle.failure],
    target: $error,
  });

  // TODO:
  // sample({
  //   clock: [$$favoriteArticle.settled, $$unfavoriteArticle.settled],
  //   target: update,
  // });

  return {
    init,
    unmounted,
    $articles,
    $pendingInitial,
    $pendingNextPage,
    $error,
    $emptyData,
    $canFetchMore,
    $$pagination,
    $$favoriteArticle,
    $$unfavoriteArticle,
  };
}

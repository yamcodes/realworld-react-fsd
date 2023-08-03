import { createQuery, update } from '@farfetched/core';
import { createEvent, createStore, sample, combine } from 'effector';
import { equals, and, not } from 'patronum';
import { Article, articleApi, articleModel } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { favoriteModel, unfavoriteModel } from '~features/article';

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
  const $$favoriteArticle = favoriteModel.createModel();
  const $$unfavoriteArticle = unfavoriteModel.createModel();

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
    .on(
      [
        $$favoriteArticle.optimisticallyUpdate,
        $$unfavoriteArticle.optimisticallyUpdate,
      ],
      (articles, article) =>
        articles.map((a) => (a.slug === article?.slug ? article : a)),
    )
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
    source: {
      query: $query.map((q) => q.query),
      auth: $$sessionModel.$visitor,
    },
    fn: ({ query, auth }) => ({ query, params: { secure: !!auth } }),
    target: [reset, articlesQuery.start, fetchInitial],
  });

  sample({
    clock: $$pagination.nextPage,
    source: {
      query: $query.map((q) => q.query),
      auth: $$sessionModel.$visitor,
    },
    fn: ({ query, auth }) => ({ query, params: { secure: !!auth } }),
    target: articlesQuery.start,
  });

  update(articlesQuery, {
    on: $$favoriteArticle.favoriteArticleMutation,
    by: {
      success: {
        source: articlesQuery.$data,
        fn: ({ mutation }, data) => ({
          result: {
            articles: data!.articles.map((a) =>
              a.slug === mutation.result.slug ? mutation.result : a,
            ),
            articlesCount: data!.articlesCount,
          },
        }),
      },
      failure: ({ mutation }) => ({
        error: mutation.error,
      }),
    },
  });

  update(articlesQuery, {
    on: $$unfavoriteArticle.unfavoriteArticleMutation,
    by: {
      success: {
        source: articlesQuery.$data,
        fn: ({ mutation }, data) => ({
          result: {
            articles: data!.articles.map((a) =>
              a.slug === mutation.result.slug ? mutation.result : a,
            ),
            articlesCount: data!.articlesCount,
          },
        }),
      },
      failure: ({ mutation }) => ({
        error: mutation.error,
      }),
    },
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
    $$favoriteArticle,
    $$unfavoriteArticle,
  };
}

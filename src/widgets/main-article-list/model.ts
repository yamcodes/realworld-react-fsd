import { attachOperation, isInvalidDataError } from '@farfetched/core';
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
  const update = createEvent();
  const reset = createEvent();
  const unmounted = createEvent();

  const fetchInitial = createEvent();

  const articlesQuery = attachOperation(articleApi.articlesQuery);

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

  const $data = createStore<{
    articles: Article[];
    articlesCount: number;
  }>({ articles: [], articlesCount: 0 }).reset(reset);

  const $articles = $data.map((data) => data.articles);
  const $articlesCount = $data.map((data) => data.articlesCount);
  const $articlesReceived = $data.map((data) => data.articles.length);

  const $emptyData = and(articlesQuery.$succeeded, not($articlesReceived));
  const $hasNextPage = not(equals($articlesCount, $articlesReceived));
  const $canFetchMore = and(not($pendingInitial), $hasNextPage);

  sample({
    clock: init,
    target: reset,
  });

  sample({
    clock: reset,
    target: [$$pagination.reset, articlesQuery.reset],
  });

  sample({
    clock: init,
    source: {
      query: $query.map((q) => q.query),
      auth: $$sessionModel.$visitor,
    },
    fn: ({ query, auth }) => ({ query, params: { secure: !!auth } }),
    target: [articlesQuery.start, fetchInitial],
  });

  sample({
    clock: update,
    source: {
      query: $query.map((q) => q.query),
      auth: $$sessionModel.$visitor,
    },
    fn: ({ query, auth }) => ({ query, params: { secure: !!auth } }),
    target: articlesQuery.start,
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

  sample({
    clock: articlesQuery.finished.success,
    source: {
      prevData: $data,
      curData: articlesQuery.$data,
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

  const $error = createStore<string | null>(null)
    .on(
      [
        articlesQuery.finished.failure,
        $$favoriteArticle.failure,
        $$unfavoriteArticle.failure,
      ],
      (_, data) => {
        if (isInvalidDataError(data)) return data.error.explanation;
        return (data.error as Error).message;
      },
    )
    .reset(init);

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

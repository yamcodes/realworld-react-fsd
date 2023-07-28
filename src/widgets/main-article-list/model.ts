import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { Query, articleApi } from '~entities/article';

export type MainArticleListModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const unmounted = createEvent();

  const $query = createStore<{ query: Query }>({
    query: { offset: 0, limit: 20 },
  });

  const articlesQuery = createQuery({
    handler: articleApi.getArticlesFx,
    name: 'articlesQuery',
  });

  sample({
    clock: init,
    source: $query,
    target: articlesQuery.start,
  });

  return { init, unmounted, articlesQuery };
}

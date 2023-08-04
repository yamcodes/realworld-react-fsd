import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { articleApi } from '~entities/article';

export type ArticleModel = ReturnType<typeof createModel>;

export function createModel() {
  const init = createEvent<string>();

  const articleQuery = createQuery({
    handler: articleApi.getArticleFx,
    name: 'articleQuery',
  });

  sample({
    clock: init,
    fn: (slug) => ({ slug }),
    target: articleQuery.start,
  });

  return { init, articleQuery };
}

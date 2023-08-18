import { createMutation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { articleApi } from '~entities/article';

export type DeleteArticleModel = ReturnType<typeof createModel>;

export function createModel() {
  const remove = createEvent<string>();
  const mutated = createEvent<string>();
  const failure = createEvent<unknown>();
  const settled = createEvent();

  const deleteArticleMutation = createMutation({
    handler: articleApi.deleteArticleFx,
    name: 'deleteArticleMutation',
  });

  sample({
    clock: remove,
    fn: (slug) => ({ slug }),
    target: deleteArticleMutation.start,
  });

  sample({
    clock: deleteArticleMutation.start,
    fn: (params) => params.slug,
    target: mutated,
  });

  sample({
    clock: deleteArticleMutation.finished.failure,
    fn: ({ error }) => ({ error }),
    target: failure,
  });

  sample({
    clock: deleteArticleMutation.finished.finally,
    target: settled,
  });

  return {
    remove,
    mutated,
    failure,
    settled,
    $pending: deleteArticleMutation.$pending,
  };
}

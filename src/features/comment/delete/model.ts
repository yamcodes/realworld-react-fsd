import { createMutation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { commentApi } from '~entities/comment';

export type DeleteCommentModel = ReturnType<typeof createModel>;

export function createModel() {
  const remove = createEvent<commentApi.DeleteCommentParams>();
  const mutated = createEvent<string>();
  const failure = createEvent<unknown>();
  const settled = createEvent();

  const deleteCommentMutation = createMutation({
    handler: commentApi.deleteCommentFx,
    name: 'deleteCommentMutation',
  });

  sample({
    clock: remove,
    target: deleteCommentMutation.start,
  });

  sample({
    clock: deleteCommentMutation.start,
    fn: (params) => params.slug,
    target: mutated,
  });

  sample({
    clock: deleteCommentMutation.finished.failure,
    fn: ({ error }) => ({ error }),
    target: failure,
  });

  sample({
    clock: deleteCommentMutation.finished.finally,
    target: settled,
  });

  return {
    remove,
    mutated,
    failure,
    settled,
    $pending: deleteCommentMutation.$pending,
  };
}

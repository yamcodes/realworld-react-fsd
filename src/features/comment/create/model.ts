import { attachOperation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Comment, commentApi } from '~entities/comment';
import { $$sessionModel } from '~entities/session';

export type CreateCommentModel = ReturnType<typeof createModel>;

export function createModel() {
  const create = createEvent<commentApi.CreateCommentMutationParams | null>();
  const mutated = createEvent<Comment>();
  const failure = createEvent<unknown>();
  const settled = createEvent();

  const createCommentMutation = attachOperation(
    commentApi.createCommentMutation,
  );

  const $params = restore(create, null);

  sample({
    clock: create,
    filter: Boolean,
    target: createCommentMutation.start,
  });

  sample({
    clock: createCommentMutation.start,
    source: { params: $params, visitor: $$sessionModel.$visitor },
    fn: ({ params, visitor }): Comment => ({
      id: +Infinity,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      body: params!.comment.body,
      author: {
        username: visitor!.username,
        bio: visitor!.bio,
        image: visitor!.image,
        following: false,
      },
    }),
    target: mutated,
  });

  sample({
    clock: createCommentMutation.finished.failure,
    fn: ({ error }) => ({ error }),
    target: failure,
  });

  sample({
    clock: createCommentMutation.finished.finally,
    target: settled,
  });

  return {
    create,
    mutated,
    failure,
    settled,
    $pending: createCommentMutation.$pending,
  };
}

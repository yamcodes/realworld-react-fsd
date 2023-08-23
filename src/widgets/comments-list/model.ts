import { createQuery } from '@farfetched/core';
import { createEvent, sample, Store } from 'effector';
import { debug } from 'patronum';
import { Article } from '~entities/article';
import { commentApi } from '~entities/comment';
import { $$sessionModel } from '~entities/session';
import { deleteCommentModel } from '~features/comment';

export type CommentsListModel = Omit<ReturnType<typeof createModel>, 'init'>;

type CommentsListConfig = {
  $article: Store<Article | null>;
};

export const createModel = (config: CommentsListConfig) => {
  const { $article } = config;

  const init = createEvent();
  const reset = createEvent();
  const unmounted = createEvent();

  const commentsQuery = createQuery({
    handler: commentApi.getCommentsFx,
    initialData: [],
    name: 'commentsQuery',
  });

  debug($article);

  sample({
    clock: init,
    target: reset,
  });

  sample({
    clock: init,
    source: { article: $article, visitor: $$sessionModel.$visitor },
    filter: ({ article }) => Boolean(article),
    fn: ({ article, visitor }) => ({
      slug: article!.slug,
      params: { secure: !!visitor },
    }),
    target: commentsQuery.start,
  });

  const $$deleteComment = deleteCommentModel.createModel();

  return {
    init,
    unmounted,
    commentsQuery,
    $slug: $article.map((a) => a?.slug),
    $$deleteComment,
  };
};

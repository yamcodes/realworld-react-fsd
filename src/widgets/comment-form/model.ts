import { Store, createEvent, sample } from 'effector';
import { string } from 'zod';
import { Article } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { createCommentModel } from '~features/comment';
import { createFormModel } from '~shared/lib/form';

export type CommentFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

type CommentFormConfig = {
  $article: Store<Article | null>;
};

export const createModel = (config: CommentFormConfig) => {
  const { $article } = config;

  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const $$commentForm = createFormModel({
    fields: {
      body: { initialValue: '', validationSchema: string().min(3) },
    },
  });

  sample({
    clock: init,
    target: $$commentForm.reset,
  });

  sample({
    clock: submitted,
    target: $$commentForm.validate,
  });

  const $$createComment = createCommentModel.createModel();

  sample({
    clock: $$commentForm.validated.success,
    source: { article: $article, comment: $$commentForm.$form },
    filter: ({ article, comment }) => Boolean(article && comment),
    fn: ({ article, comment }) => ({ slug: article!.slug, comment }),
    target: $$createComment.create,
  });

  return {
    init,
    unmounted,
    submitted,
    fields: $$commentForm.fields,
    $visitor: $$sessionModel.$visitor,
    $pending: $$createComment.$pending,
  };
};

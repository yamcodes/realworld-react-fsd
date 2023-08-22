import { createEvent, restore, sample } from 'effector';
import { string } from 'zod';
import { Article } from '~entities/article';
import { updateArticleModel } from '~features/article';
import { createFormModel } from '~shared/lib/form';

export type CommentFormModel = Omit<ReturnType<typeof createModel>, 'init'>;

export const createModel = () => {
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

  const $$updateArticle = updateArticleModel.createModel();

  sample({
    clock: $$editorForm.validated.success,
    source: {
      updateArticle: $$editorForm.$form,
      articleToEdit: $articleToEdit,
    },
    filter: ({ articleToEdit }) => Boolean(articleToEdit),
    fn: ({
      updateArticle,
      articleToEdit,
    }): updateArticleModel.UpdateArticleConfig => ({
      prevArticle: articleToEdit!,
      updateArticle: {
        ...updateArticle!,
        tagList: updateArticle?.tagList.split(',').map((tag) => tag.trim()),
      },
    }),
    target: $$updateArticle.update,
  });

  return {
    init,
    unmounted,
    submitted,
    fields: $$editorForm.fields,
    $pending: $$updateArticle.$pending,
  };
};

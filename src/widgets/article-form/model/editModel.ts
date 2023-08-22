import { createEvent, restore, sample } from 'effector';
import { string } from 'zod';
import { Article } from '~entities/article';
import { updateArticleModel } from '~features/article';
import { createFormModel } from '~shared/lib/form';

export type EditModel = Omit<ReturnType<typeof createEditModel>, 'init'>;

export const createEditModel = () => {
  const init = createEvent<Article>();
  const submitted = createEvent();
  const unmounted = createEvent();

  const $articleToEdit = restore(init, null);

  const $$editorForm = createFormModel({
    fields: {
      title: { initialValue: '', validationSchema: string().min(3) },
      description: { initialValue: '', validationSchema: string().min(3) },
      body: { initialValue: '', validationSchema: string().min(3) },
      tagList: { initialValue: '', validationSchema: string().min(3) },
    },
  });

  sample({
    clock: init,
    target: $$editorForm.reset,
  });

  sample({
    clock: init,
    fn: ({ title, description, body, tagList }) => ({
      title,
      description,
      body,
      tagList: tagList.join(', '),
    }),
    target: $$editorForm.setForm,
  });

  sample({
    clock: submitted,
    target: $$editorForm.validate,
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

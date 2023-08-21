import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { NewArticle } from '~entities/article';
import { createArticleModel } from '~features/article';
import { createFormModel } from '~shared/lib/form';

export type NewModel = Omit<ReturnType<typeof createNewModel>, 'init'>;

export const createNewModel = () => {
  const init = createEvent();
  const submitted = createEvent();
  const unmounted = createEvent();

  const $$editorForm = createFormModel({
    fields: {
      title: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      description: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      body: {
        initialValue: '',
        validationSchema: string().min(3),
      },
      tagList: {
        initialValue: '',
        validationSchema: string().min(3),
      },
    },
  });

  sample({
    clock: init,
    target: $$editorForm.reset,
  });

  sample({
    clock: submitted,
    target: $$editorForm.validate,
  });

  const $$createArticle = createArticleModel.createModel();

  sample({
    clock: $$editorForm.validated.success,
    source: $$editorForm.$form,
    fn: (newArticle): NewArticle => ({
      ...newArticle,
      tagList: newArticle?.tagList
        ? newArticle.tagList.split(',').map((tag) => tag.trim())
        : [],
    }),
    target: $$createArticle.create,
  });

  return {
    init,
    unmounted,
    submitted,
    fields: $$editorForm.fields,
    $pending: $$createArticle.$pending,
  };
};

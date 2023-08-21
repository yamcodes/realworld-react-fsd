import { createEvent, sample } from 'effector';
import { createLoaderEffect } from '~shared/lib/router';
import { articleFormModel } from '~widgets/article-form';

const createModel = () => {
  const opened = createEvent();

  const newArticleLoaderFx = createLoaderEffect(async () => null);

  const $$newArticleForm = articleFormModel.createNewModel();

  sample({
    clock: opened,
    target: $$newArticleForm.init,
  });

  return {
    newArticleLoaderFx,
    $$newArticleForm,
  };
};

export const { newArticleLoaderFx, ...$$editorNewArticlePage } = createModel();

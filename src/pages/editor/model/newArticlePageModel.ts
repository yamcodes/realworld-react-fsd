import { attach, createEvent, sample } from 'effector';
import { redirect } from 'react-router-dom';
import { $$sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/router';
import { articleFormModel } from '~widgets/article-form';

const createModel = () => {
  const opened = createEvent();

  const newArticleLoaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor) => {
      if (!visitor) return redirect(PATH_PAGE.root);
      opened();
      return null;
    },
  });

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

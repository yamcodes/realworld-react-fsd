import { attach, createEvent, sample } from 'effector';
import { redirect } from 'react-router-dom';
import { $$sessionModel } from '~entities/session';
import { $ctx } from '~shared/ctx';
import { PATH_PAGE } from '~shared/lib/router';
import { articleFormModel } from '~widgets/article-form';

const createModel = () => {
  const opened = createEvent();

  const editArticleLoaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor) => {
      if (!visitor) return redirect(PATH_PAGE.root);
      opened();
      return null;
    },
  });

  const getArticleToEditFx = attach({
    source: $ctx,
    effect: async (ctx) => ctx.router.state.navigation.location?.state || null,
  });

  sample({
    clock: opened,
    target: getArticleToEditFx,
  });

  const $$editArticleForm = articleFormModel.createEditModel();

  sample({
    clock: getArticleToEditFx.doneData,
    filter: Boolean,
    target: $$editArticleForm.init,
  });

  return {
    editArticleLoaderFx,
    $$editArticleForm,
  };
};

export const { editArticleLoaderFx, ...$$editorEditArticlePage } =
  createModel();

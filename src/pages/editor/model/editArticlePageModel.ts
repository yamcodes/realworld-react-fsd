import { attach, createEvent, sample } from 'effector';
import { debug } from 'patronum';
import { $ctx } from '~shared/ctx';
import { createLoaderEffect } from '~shared/lib/router';
import { articleFormModel } from '~widgets/article-form';

const createModel = () => {
  const opened = createEvent();

  const editArticleLoaderFx = createLoaderEffect(async () => {
    opened();
    return null;
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

  debug(getArticleToEditFx.doneData);

  return {
    editArticleLoaderFx,
    $$editArticleForm,
  };
};

export const { editArticleLoaderFx, ...$$editorEditArticlePage } =
  createModel();

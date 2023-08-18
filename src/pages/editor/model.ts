import { createEvent, sample } from 'effector';
import { string } from 'zod';
import { NewArticle } from '~entities/article';
import { createArticleModel } from '~features/article';
import { createFormModel } from '~shared/lib/form';
import { createLoaderEffect } from '~shared/lib/router';

const createModel = () => {
  const opened = createEvent();
  const unmounted = createEvent();
  const submitted = createEvent();

  const newArtilceEditorLoaderFx = createLoaderEffect(
    async () =>
      // opened();
      null,
  );

  const curArticleEditorLoaderFx = createLoaderEffect(async () => {
    opened();
    return null;
  });

  // const getLocationStateFx = attach({
  //   source: $ctx,
  //   effect: async (ctx) => ctx.router.state.navigation.location?.state,
  // });

  // const $locationState = createStore<string | null>(null).reset(opened);

  // sample({
  //   clock: opened,
  //   target: getLocationStateFx,
  // });

  // sample({
  //   clock: getLocationStateFx.doneData,
  //   target: $locationState,
  // });

  // debug($locationState);

  const $$createArticle = createArticleModel.createModel();

  const $$editorForm = createFormModel({
    fields: {
      title: { initialValue: '', validationSchema: string().min(3) },
      description: { initialValue: '', validationSchema: string().min(3) },
      body: { initialValue: '', validationSchema: string().min(3) },
      tagList: { initialValue: '', validationSchema: string().min(3) },
    },
  });

  sample({
    clock: opened,
    target: $$editorForm.reset,
  });

  sample({
    clock: submitted,
    target: $$editorForm.validate,
  });

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
    newArtilceEditorLoaderFx,
    curArticleEditorLoaderFx,
    unmounted,
    submitted,
    fields: $$editorForm.fields,
    $pending: $$createArticle.$pending,
  };
};

export const {
  newArtilceEditorLoaderFx,
  curArticleEditorLoaderFx,
  ...$$editorPage
} = createModel();

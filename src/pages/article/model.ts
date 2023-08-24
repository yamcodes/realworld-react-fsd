import { attachOperation, isInvalidDataError } from '@farfetched/core';
import { createEvent, sample, restore, createStore } from 'effector';
import { Article, articleApi } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import {
  deleteArticleModel,
  favoriteModel,
  unfavoriteModel,
} from '~features/article';
import { followModel, unfollowModel } from '~features/profile';
import { createLoaderEffect } from '~shared/lib/router';
import { commentFormModel } from '~widgets/comment-form';
import { commentsListModel } from '~widgets/comments-list';

const createModel = () => {
  const update = createEvent();
  const opened = createEvent<string>();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async (args) => {
    const slug = args.params!.slug!;
    opened(slug);
    return null;
  });

  const $slug = restore(opened, null);

  const articleQuery = attachOperation(articleApi.articleQuery);

  sample({
    clock: [opened, update],
    source: { slug: $slug, visitor: $$sessionModel.$visitor },
    filter: ({ slug }) => Boolean(slug),
    fn: ({ slug, visitor }) => ({
      slug: slug!,
      params: { secure: Boolean(visitor) },
    }),
    target: articleQuery.start,
  });

  const $$accessModel = $$sessionModel.createAccessModel();

  sample({
    clock: articleQuery.finished.success,
    source: { visitor: $$sessionModel.$visitor, article: articleQuery.$data },
    fn: ({ visitor, article }) => ({
      visitor,
      username: article!.author.username,
    }),
    target: $$accessModel.init,
  });

  const $$followProfile = followModel.createModel();
  const $$unfollowProfile = unfollowModel.createModel();

  const $$favoriteArticle = favoriteModel.createModel();
  const $$unfavoriteArticle = unfavoriteModel.createModel();

  const $$deleteArticle = deleteArticleModel.createModel();

  const $error = createStore<string | null>(null)
    .on(
      [
        articleQuery.finished.failure,
        $$followProfile.failure,
        $$unfollowProfile.failure,
        $$favoriteArticle.failure,
        $$unfavoriteArticle.failure,
      ],
      (_, data) => {
        if (isInvalidDataError(data)) return data.error.explanation;
        return (data.error as Error).message;
      },
    )
    .reset(opened);

  const $mutatedArticle = createStore<Article | null>(null)
    .on(
      [$$followProfile.mutated, $$unfollowProfile.mutated],
      (prevArticle, author) =>
        prevArticle ? { ...prevArticle, author } : null,
    )
    .on(
      [$$favoriteArticle.mutated, $$unfavoriteArticle.mutated],
      (_, article) => article,
    );

  sample({
    clock: [
      $$followProfile.mutated,
      $$unfollowProfile.mutated,
      $$favoriteArticle.mutated,
      $$unfavoriteArticle.mutated,
    ],
    source: $mutatedArticle,
    target: articleQuery.$data,
  });

  sample({
    clock: [
      $$followProfile.settled,
      $$unfollowProfile.settled,
      $$favoriteArticle.settled,
      $$unfavoriteArticle.settled,
    ],
    target: update,
  });

  const $$commentForm = commentFormModel.createModel({
    $article: articleQuery.$data,
  });

  sample({
    clock: articleQuery.finished.finally,
    target: $$commentForm.init,
  });

  const $$commentsList = commentsListModel.createModel({
    $article: articleQuery.$data,
  });

  sample({
    clock: articleQuery.finished.finally,
    target: $$commentsList.init,
  });

  return {
    loaderFx,
    unmounted,
    $access: $$accessModel.$access,
    $article: articleQuery.$data,
    $pending: articleQuery.$pending,
    $error,
    $$followProfile,
    $$unfollowProfile,
    $$favoriteArticle,
    $$unfavoriteArticle,
    $$deleteArticle,
    $$commentForm,
    $$commentsList,
  };
};

export const { loaderFx, ...$$articlePage } = createModel();

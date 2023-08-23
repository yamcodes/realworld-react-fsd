import { createQuery } from '@farfetched/core';
import { createEvent, sample, restore, combine, createStore } from 'effector';
import { Article, articleApi } from '~entities/article';
import { $$sessionModel, User } from '~entities/session';
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

  const articleQuery = createQuery({
    handler: articleApi.getArticleFx,
    name: 'articleQuery',
  });

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

  const $articleCtx = combine(
    [articleQuery.$data, $$sessionModel.$visitor],
    ([article, visitor]) => {
      switch (true) {
        case isAuth(visitor, article?.author.username || null):
          return 'auth';

        case isAnon(visitor, article?.author.username || null):
          return 'anon';

        case isOwner(visitor, article?.author.username || null):
          return 'owner';

        default:
          return null;
      }
    },
  );

  const $$followProfile = followModel.createModel();
  const $$unfollowProfile = unfollowModel.createModel();

  const $$favoriteArticle = favoriteModel.createModel();
  const $$unfavoriteArticle = unfavoriteModel.createModel();

  const $$deleteArticle = deleteArticleModel.createModel();

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
      $$followProfile.failure,
      $$unfollowProfile.failure,
      $$favoriteArticle.failure,
      $$unfavoriteArticle.failure,
    ],
    target: articleQuery.$error,
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

  // FIXME: clock
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
    articleQuery,
    $articleCtx,
    $$followProfile,
    $$unfollowProfile,
    $$favoriteArticle,
    $$unfavoriteArticle,
    $$deleteArticle,
    $$commentForm,
    $$commentsList,
  };
};

const isAuth = (visitor: User | null, username: string | null) =>
  Boolean(visitor && username && visitor.username !== username);

const isOwner = (visitor: User | null, username: string | null) =>
  Boolean(visitor && username && visitor.username === username);

const isAnon = (visitor: User | null, username: string | null) =>
  Boolean(!visitor && username);

export const { loaderFx, ...$$articlePage } = createModel();

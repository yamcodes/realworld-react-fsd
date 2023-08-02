/* eslint-disable @typescript-eslint/no-shadow */
import { attach, combine, createEvent, restore, sample } from 'effector';
import { articleModel } from '~entities/article';
import { $$sessionModel, User } from '~entities/session';
import { $ctx } from '~shared/ctx';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { profileInfoModel } from '~widgets/profile-info';

const createModel = () => {
  const opened = createEvent<string | null>();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async (args) => {
    opened(args.params?.username || null);
    return null;
  });

  const $username = restore(opened, null);

  const navigateToUser = createEvent();
  const navigateToUserFavorites = createEvent();

  const navigateToUserFx = attach({
    source: { ctx: $ctx, username: $username },
    effect: ({ ctx, username }) => ctx.router.navigate(`/profile/${username}`),
    name: 'navigateToUserFx',
  });

  const navigateToUserFavoritesFx = attach({
    source: { ctx: $ctx, username: $username },
    effect: ({ ctx, username }) =>
      ctx.router.navigate(`/profile/${username}/favorites`),
    name: 'navigateToUserFavoritesFx',
  });

  sample({
    clock: navigateToUser,
    target: navigateToUserFx,
  });

  sample({
    clock: navigateToUserFavorites,
    target: navigateToUserFavoritesFx,
  });

  const $context = combine(
    [$username, $$sessionModel.$visitor],
    ([username, visitor]) => {
      switch (true) {
        case isAuth(visitor, username):
          return 'auth';

        case isVisitor(visitor, username):
          return 'visitor';

        default:
          return 'anon';
      }
    },
  );

  const $$profileInfo = {
    auth: profileInfoModel.createAuthModel({ $username }),
    visitor: profileInfoModel.createVisitorModel(),
    anon: profileInfoModel.createAnonModel({ $username }),
  };

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'auth',
    target: $$profileInfo.auth.init,
  });

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'visitor',
    target: $$profileInfo.visitor.init,
  });

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'anon',
    target: $$profileInfo.anon.init,
  });

  const $$queryModel = articleModel.createQueryModel();

  sample({
    clock: opened,
    source: $username,
    filter: Boolean,
    fn: (username): articleModel.QueryInit => ({
      filter: { filter: 'author', value: username },
    }),
    target: $$queryModel.init,
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $query: $$queryModel.$query,
    loadNextPageOn: $$queryModel.$$pagination.nextPage,
    testOn: $$queryModel.$$filter.filterChanged,
  });

  sample({
    clock: opened,
    target: $$mainArticleList.init,
  });

  return {
    loaderFx,
    unmounted,
    $username,
    $context,
    $$profileInfo,
    $$queryModel,
    $$mainArticleList,
    navigateToUser,
    navigateToUserFavorites,
  };
};

export const { loaderFx, ...$$profilePage } = createModel();

function isAuth(visitor: User | null, username: string | null) {
  return visitor && username && visitor.username !== username;
}

function isVisitor(visitor: User | null, username: string | null) {
  return visitor && visitor.username === username;
}

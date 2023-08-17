import { combine, createEvent, restore, sample } from 'effector';
import { debug } from 'patronum';
import { articleModel } from '~entities/article';
import { $$sessionModel, User } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { profileInfoModel } from '~widgets/profile-info';

export type PageCtx = {
  username: string;
  path: 'author' | 'favorited';
};

const createModel = () => {
  const opened = createEvent<PageCtx>();
  const unmounted = createEvent();

  const usernameLoaderFx = createLoaderEffect(async (args) => {
    const username = args.params!.username!;
    opened({ username, path: 'author' });
    return null;
  });

  const favoritesLoaderFx = createLoaderEffect(async (args) => {
    const username = args.params!.username!;
    opened({ username, path: 'favorited' });
    return null;
  });

  const $pageCtx = restore(opened, null);

  const $username = $pageCtx.map(
    (pageContext) => pageContext?.username || null,
  );

  const $profileCtx = combine(
    [$username, $$sessionModel.$visitor],
    ([username, visitor]) => {
      switch (true) {
        case isAuth(visitor, username):
          return 'auth';

        case isAnon(visitor, username):
          return 'anon';

        case isOwner(visitor, username):
          return 'owner';

        default:
          return null;
      }
    },
  );

  debug($username);
  debug($profileCtx);

  const $$profileInfo = {
    anon: profileInfoModel.createAnonModel({ $username }),
    auth: profileInfoModel.createAuthModel({ $username }),
    owner: profileInfoModel.createOwnerModel(),
  };

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (ctx) => ctx === 'anon',
    target: $$profileInfo.anon.init,
  });

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (ctx) => ctx === 'auth',
    target: $$profileInfo.auth.init,
  });

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (ctx) => ctx === 'owner',
    target: $$profileInfo.owner.init,
  });

  const $$filterModel = articleModel.createFilterModel();

  sample({
    clock: opened,
    source: $pageCtx,
    filter: Boolean,
    fn: getInitialFilter,
    target: $$filterModel.init,
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $filterQuery: $$filterModel.$query,
  });

  sample({
    clock: opened,
    target: $$mainArticleList.init,
  });

  return {
    usernameLoaderFx,
    favoritesLoaderFx,
    unmounted,
    $pageCtx,
    $profileCtx,
    $$profileInfo,
    $$filterModel,
    $$mainArticleList,
  };
};

const isAuth = (visitor: User | null, username: string | null) =>
  Boolean(visitor && username && visitor.username !== username);

const isOwner = (visitor: User | null, username: string | null) =>
  Boolean(visitor && username && visitor.username === username);

const isAnon = (visitor: User | null, username: string | null) =>
  Boolean(!visitor && username);

const getInitialFilter = (pageCtx: PageCtx): articleModel.FilterInit => ({
  key: pageCtx.path,
  value: pageCtx.username,
});

export const { usernameLoaderFx, favoritesLoaderFx, ...$$profilePage } =
  createModel();

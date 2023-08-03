import { combine, createEvent, restore, sample } from 'effector';
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

        case isOwner(visitor, username):
          return 'owner';

        default:
          return 'anon';
      }
    },
  );

  const $$profileInfo = {
    auth: profileInfoModel.createAuthModel({ $username }),
    owner: profileInfoModel.createOwnerModel(),
    anon: profileInfoModel.createAnonModel({ $username }),
  };

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (profileCtx) => profileCtx === 'auth',
    target: $$profileInfo.auth.init,
  });

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (profileCtx) => profileCtx === 'owner',
    target: $$profileInfo.owner.init,
  });

  sample({
    clock: opened,
    source: $profileCtx,
    filter: (profileCtx) => profileCtx === 'anon',
    target: $$profileInfo.anon.init,
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
  visitor && username && visitor.username !== username;

const isOwner = (visitor: User | null, username: string | null) =>
  visitor && visitor.username === username;

const getInitialFilter = (pageCtx: PageCtx): articleModel.FilterInit => ({
  filter: pageCtx.path,
  value: pageCtx.username,
});

export const { usernameLoaderFx, favoritesLoaderFx, ...$$profilePage } =
  createModel();

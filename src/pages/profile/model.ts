import { combine, createEvent, restore, sample } from 'effector';
import { $$sessionModel, User } from '~entities/session';
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

  const $$mainArticleList = mainArticleListModel.createModel();

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
    $$mainArticleList,
  };
};

export const { loaderFx, ...$$profilePage } = createModel();

function isAuth(visitor: User | null, username: string | null) {
  return visitor && username && visitor.username !== username;
}

function isVisitor(visitor: User | null, username: string | null) {
  return visitor && visitor.username === username;
}

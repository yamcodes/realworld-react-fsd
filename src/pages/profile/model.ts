import { combine, createEvent, restore, sample } from 'effector';
import { articleModel } from '~entities/article';
import { $$sessionModel, User } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { profileInfoModel } from '~widgets/profile-info';

const createModel = () => {
  const opened = createEvent<{
    username: string;
    isFavorites: boolean;
  }>();
  const unmounted = createEvent();

  const loaderFx = createLoaderEffect(async (args) => {
    const url = new URL(args.request.url);

    const username = args.params!.username!;
    const isFavorites = url.pathname.split('/').pop() === 'favorites';

    opened({ username, isFavorites });

    return null;
  });

  const $pageContext = restore(opened, null);
  const $username = $pageContext.map(
    (pageContext) => pageContext?.username || null,
  );

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
    source: $pageContext,
    filter: Boolean,
    fn: ({ username, isFavorites }): articleModel.QueryInit => ({
      filter: { filter: isFavorites ? 'favorited' : 'author', value: username },
    }),
    target: $$queryModel.init,
  });

  const $$mainArticleList = mainArticleListModel.createModel({
    $query: $$queryModel.$query,
    loadNextPageOn: $$queryModel.$$pagination.nextPage,
  });

  sample({
    clock: [opened, $$queryModel.$$filter.filterChanged],
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
  };
};

export const { loaderFx, ...$$profilePage } = createModel();

function isAuth(visitor: User | null, username: string | null) {
  return visitor && username && visitor.username !== username;
}

function isVisitor(visitor: User | null, username: string | null) {
  return visitor && visitor.username === username;
}

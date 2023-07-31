import { combine, createEvent, restore, sample } from 'effector';
import { $$sessionModel, User } from '~entities/session';
import { createLoaderEffect } from '~shared/lib/router';
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

  const $$profileInfoModel = {
    auth: profileInfoModel.createAuthModel({ $username }),
    visitor: profileInfoModel.createVisitorModel(),
    anon: profileInfoModel.createAnonModel({ $username }),
  };

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'auth',
    target: $$profileInfoModel.auth.init,
  });

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'visitor',
    target: $$profileInfoModel.visitor.init,
  });

  sample({
    clock: opened,
    source: $context,
    filter: (context) => context === 'anon',
    target: $$profileInfoModel.anon.init,
  });

  return {
    loaderFx,
    unmounted,
    $context,
    $$profileInfoModel,
  };
};

export const { loaderFx, ...$$profilePage } = createModel();

function isAuth(visitor: User | null, username: string | null) {
  return visitor && username && visitor.username !== username;
}

function isVisitor(visitor: User | null, username: string | null) {
  return visitor && visitor.username === username;
}

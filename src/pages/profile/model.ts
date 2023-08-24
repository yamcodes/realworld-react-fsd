import {
  attach,
  createEvent,
  createStore,
  restore,
  sample,
  createApi,
  combine,
} from 'effector';
import { LoaderFunctionArgs } from 'react-router-dom';
import { articleModel } from '~entities/article';
import { $$sessionModel } from '~entities/session';
import { PATH_PAGE } from '~shared/lib/router';
import { mainArticleListModel } from '~widgets/main-article-list';
import { profileInfoModel } from '~widgets/profile-info';

export type Tab = 'author' | 'favorited';

function createModel() {
  const opened = createEvent<string>();
  const unmounted = createEvent();

  const $tab = createStore<Tab>('author');
  const $username = restore(opened, null);

  const $initFilter = combine($tab, $username, (tab, username) => ({
    key: tab,
    value: username!,
  }));

  const tabApi = createApi($tab, {
    author: () => 'author',
    favorited: () => 'favorited',
  });

  const $$accessModel = $$sessionModel.createAccessModel();

  const loaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor, args: LoaderFunctionArgs) => {
      const username = args.params!.username!;

      $$accessModel.init({ visitor, username });

      const pathname = decodeURI(new URL(args.request.url).pathname);

      if (pathname === PATH_PAGE.profile.root(username)) tabApi.author();
      if (pathname === PATH_PAGE.profile.favorites(username))
        tabApi.favorited();

      opened(username);

      return null;
    },
  });

  const $$profileInfo = {
    anon: profileInfoModel.createAnonModel({ $username }),
    auth: profileInfoModel.createAuthModel({ $username }),
    owner: profileInfoModel.createOwnerModel(),
  };

  sample({
    clock: opened,
    source: $$accessModel.$access,
    filter: (access) => access === 'anon',
    target: $$profileInfo.anon.init,
  });

  sample({
    clock: opened,
    source: $$accessModel.$access,
    filter: (access) => access === 'auth',
    target: $$profileInfo.auth.init,
  });

  sample({
    clock: opened,
    source: $$accessModel.$access,
    filter: (access) => access === 'owner',
    target: $$profileInfo.owner.init,
  });

  const $$filterModel = articleModel.createFilterModel();

  sample({
    clock: opened,
    source: $initFilter,
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
    loaderFx,
    unmounted,
    $username,
    $access: $$accessModel.$access,
    $tab,
    $$profileInfo,
    $$filterModel,
    $$mainArticleList,
  };
}

export const { loaderFx, ...$$profilePage } = createModel();

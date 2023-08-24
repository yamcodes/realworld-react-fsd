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

export type Access = 'anon' | 'auth' | 'owner' | null;
export type Tab = 'author' | 'favorited';

const createModel = () => {
  const opened = createEvent<string>();
  const unmounted = createEvent();

  const $access = createStore<Access>(null);
  const $tab = createStore<Tab>('author');
  const $username = restore(opened, null);

  const $initFilter = combine($tab, $username, (tab, username) => ({
    key: tab,
    value: username!,
  }));

  const accessApi = createApi($access, {
    anon: () => 'anon',
    auth: () => 'auth',
    owner: () => 'owner',
  });

  const tabApi = createApi($tab, {
    author: () => 'author',
    favorited: () => 'favorited',
  });

  const loaderFx = attach({
    source: $$sessionModel.$visitor,
    effect: async (visitor, args: LoaderFunctionArgs) => {
      const username = args.params!.username!;

      if (!visitor) accessApi.anon();
      if (visitor && username !== visitor.username) accessApi.auth();
      if (visitor && username === visitor.username) accessApi.owner();

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
    source: $access,
    filter: (access) => access === 'anon',
    target: $$profileInfo.anon.init,
  });

  sample({
    clock: opened,
    source: $access,
    filter: (access) => access === 'auth',
    target: $$profileInfo.auth.init,
  });

  sample({
    clock: opened,
    source: $access,
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
    $access,
    $tab,
    $$profileInfo,
    $$filterModel,
    $$mainArticleList,
  };
};

export const { loaderFx, ...$$profilePage } = createModel();

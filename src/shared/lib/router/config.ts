import { attach, createStore } from 'effector';
import { $ctx } from '~shared/ctx';

export const PATH_PAGE = {
  root: '/',
  login: '/login',
  register: '/register',
  settings: '/settings',
  profile: {
    root: (username: string) => `/profile/${username}`,
    favorites: (username: string) => `/profile/${username}/favorites`,
  },
  editor: {
    root: '/editor',
    edit: (slug: string) => `/editor/${slug}`,
  },
  article: {
    slug: (slug: string) => `/article/${slug}`,
  },
  page404: '/404',
};

const $PATH_PAGE = createStore(PATH_PAGE);

export const toHomeFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.root),
});

export const toLoginFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.login),
});

export const toRegisterFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.register),
});

export const toSettingsFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.settings),
});

export const toProfileFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }, username: string) =>
    ctx.router.navigate(PATH.profile.root(username)),
});

export const toProfileFavoritesFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }, username: string) =>
    ctx.router.navigate(PATH.profile.favorites(username)),
});

export const toEditorFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.editor.root),
});

export const toEditorWithArticleFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }, slug: string) =>
    ctx.router.navigate(PATH.editor.edit(slug)),
});

export const toArticleFx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }, slug: string) =>
    ctx.router.navigate(PATH.article.slug(slug)),
});

export const toPage404Fx = attach({
  source: { ctx: $ctx, PATH: $PATH_PAGE },
  effect: ({ ctx, PATH }) => ctx.router.navigate(PATH.page404),
});

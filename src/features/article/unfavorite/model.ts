import { createMutation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Article, articleApi } from '~entities/article';

export type UnfavoriteArticleModel = ReturnType<typeof createModel>;

export function createModel() {
  const unfavorite = createEvent<Article>();
  const optimisticallyUpdate = createEvent<Article>();

  const unfavoriteArticleMutation = createMutation({
    handler: articleApi.deleteArticleFavoriteFx,
    name: 'unfavoriteArticleMutation',
  });

  const $article = restore(unfavorite, null);
  const $slug = $article.map((article) => article?.slug);

  sample({
    clock: unfavorite,
    source: $slug,
    filter: Boolean,
    fn: (slug) => ({ slug }),
    target: unfavoriteArticleMutation.start,
  });

  sample({
    clock: unfavoriteArticleMutation.start,
    source: $article,
    filter: Boolean,
    fn: (article) => ({
      ...article,
      favorited: false,
      favoritesCount: article.favoritesCount - 1,
    }),
    target: optimisticallyUpdate,
  });

  return {
    unfavoriteArticleMutation,
    optimisticallyUpdate,
    unfavorite,
  };
}

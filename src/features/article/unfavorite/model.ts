import { attachOperation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Article, articleApi } from '~entities/article';

export type UnfavoriteArticleModel = ReturnType<typeof createModel>;

export function createModel() {
  const unfavorite = createEvent<Article>();
  const mutated = createEvent<Article>();

  const unfavoriteArticleMutation = attachOperation(
    articleApi.unfavoriteArticleMutation,
  );

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
    target: mutated,
  });

  return {
    unfavorite,
    mutated,
    failure: unfavoriteArticleMutation.finished.failure,
    settled: unfavoriteArticleMutation.finished.finally,
  };
}

import { createMutation } from '@farfetched/core';
import { createEvent, restore, sample } from 'effector';
import { Article, UpdateArticle, articleApi } from '~entities/article';
import { $$sessionModel } from '~entities/session';

export type UpdateArticleModel = ReturnType<typeof createModel>;

export type UpdateArticleConfig = {
  prevArticle: Article;
  updateArticle: UpdateArticle;
};

export function createModel() {
  const update = createEvent<UpdateArticleConfig>();
  const mutated = createEvent<Article>();
  const failure = createEvent<unknown>();
  const settled = createEvent();

  const updateArticleMutation = createMutation({
    handler: articleApi.updateArticleFx,
    name: 'updateArticleMutation',
  });

  const $articleState = restore(update, null);

  sample({
    clock: update,
    source: $articleState,
    filter: Boolean,
    fn: ({ prevArticle, updateArticle }) => ({
      slug: prevArticle.slug,
      article: updateArticle,
    }),
    target: updateArticleMutation.start,
  });

  sample({
    clock: updateArticleMutation.start,
    source: { articleState: $articleState, visitor: $$sessionModel.$visitor },
    filter: ({ articleState, visitor }) => Boolean(articleState && visitor),
    fn: ({ articleState }) =>
      ({
        ...articleState!.prevArticle,
        ...(articleState!.updateArticle?.title && {
          title: articleState!.updateArticle.title,
        }),
        ...(articleState!.updateArticle?.description && {
          description: articleState!.updateArticle.description,
        }),
        ...(articleState!.updateArticle?.body && {
          body: articleState!.updateArticle.body,
        }),
        ...(articleState!.updateArticle?.tagList && {
          tagList: articleState!.updateArticle.tagList,
        }),
        updatedAt: new Date(Date.now()).toISOString(),
      } as Article),
    target: mutated,
  });

  sample({
    clock: updateArticleMutation.finished.failure,
    fn: ({ error }) => ({ error }),
    target: failure,
  });

  sample({
    clock: updateArticleMutation.finished.finally,
    target: settled,
  });

  return {
    update,
    mutated,
    failure,
    settled,
    $pending: updateArticleMutation.$pending,
  };
}

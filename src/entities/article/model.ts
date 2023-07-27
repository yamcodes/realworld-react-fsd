import { createEvent, createStore } from 'effector';
import { Article } from './types';

export type ArticleModel = ReturnType<typeof createModel>;

export function createModel() {
  const init = createEvent<Article>();
  const reset = createEvent();

  const $article = createStore<Article>(null as never)
    .on(init, (_, article) => article)
    .reset(reset);

  return { init, reset, $article };
}

export function createArticlesModel() {
  const init = createEvent<Article[]>();
  const reset = createEvent();

  const $articles = createStore<Article[]>([]).on(
    init,
    (prevArticles, articles) => [...prevArticles, ...articles],
  );

  return { init, reset, $articles };
}

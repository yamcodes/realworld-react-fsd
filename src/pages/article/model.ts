import {
  createEvent,
  createStore,
  createEffect,
  sample,
  attach,
} from 'effector';
import {
  ArticleDto,
  GenericErrorModel,
  RequestParams,
  realworldApi,
} from '~shared/api/realworld';

type Params = {
  slug: string;
  params?: RequestParams;
};

const articleGetFx = createEffect<Params, ArticleDto, GenericErrorModel>(
  async ({ slug, params }) => {
    const response = await realworldApi.articles.getArticle(slug, {
      ...params,
    });
    return response.data.article;
  },
);

const articleRequestFx = attach({ effect: articleGetFx });

export const $article = createStore<ArticleDto | null>(null);
export const $pending = articleRequestFx.pending;
export const $error = createStore<GenericErrorModel | null>(null);
const $slug = createStore<string | null>(null);

export const articleRouteOpened = createEvent<Params>();

$article.on(articleRequestFx.doneData, (_, article) => article);
$error.on(articleRequestFx.failData, (_, error) => error);
$slug.on(articleRouteOpened, (_, { slug }) => slug);

sample({
  clock: articleRouteOpened,
  fn: ({ slug, params }) => ({ slug, params }),
  target: articleRequestFx,
});

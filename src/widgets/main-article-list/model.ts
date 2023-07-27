// import { createEvent } from 'effector';
// import { articleApi } from '~entities/article';
// import { createQuery } from '~shared/api/createQuery';

// export function createModel() {
//   const init = createEvent();

//   const $$articlesQuery = createQuery({
//     name: 'articlesQuery',
//     fx: articleApi.getArticlesFx,
//     params: { query: { limit: 20, offset: 0 } },
//   });

//   return { init, $response: $$articlesQuery.$response };
// }

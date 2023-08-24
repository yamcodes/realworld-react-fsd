import {
  createEvent,
  createStore,
  Store,
  createApi,
  combine,
  sample,
} from 'effector';
import { ArticlesQuery } from '~shared/api/realworld';

export type QueryInit = {
  filter?: FilterInit;
  pagination?: PaginationInit;
};

export type QueryModel = ReturnType<typeof createQueryModel>;
export type QueryStore = QueryModel['$query'];

export function createQueryModel() {
  const init = createEvent<QueryInit | void>();
  const reset = createEvent();

  const $$filter = createFilterModel();
  const $$pagination = createPaginationModel();

  const $query = combine(
    $$pagination.$query,
    $$filter.$query,
    (pageQuery, filterQuery) => ({
      query: { ...pageQuery, ...filterQuery },
    }),
  );

  sample({
    clock: init,
    fn: (query) => query && query.filter,
    target: $$filter.init,
  });

  sample({
    clock: init,
    fn: (query) => query && query.pagination,
    target: $$pagination.init,
  });

  sample({
    clock: $$filter.filterChanged,
    target: [$$pagination.reset],
  });

  return {
    init,
    reset,
    $query,
    $$filter,
    $$pagination,
  };
}

type PaginationQuery = Required<Pick<ArticlesQuery, 'limit' | 'offset'>>;

type PaginationInit = {
  page?: number;
  pageSize?: number;
  step?: number;
};

type PaginationConfig = Required<PaginationInit>;

export type PaginationModel = ReturnType<typeof createPaginationModel>;

export function createPaginationModel() {
  const init = createEvent<PaginationInit | void>();
  const reset = createEvent();
  const nextPage = createEvent();
  const pageChanged = createEvent();

  const $config = createStore<PaginationConfig>({
    page: 1,
    pageSize: 10,
    step: 1,
  })
    .on(init, (defaultConfig, newConfig) => ({
      ...defaultConfig,
      ...newConfig,
    }))
    .on(nextPage, (config) => ({
      ...config,
      page: config.page + config.step,
    }))
    .reset(reset);

  const $query: Store<PaginationQuery> = $config.map(({ page, pageSize }) => ({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }));

  sample({
    clock: nextPage,
    target: pageChanged,
  });

  return { init, reset, nextPage, pageChanged, $query };
}

export type FilterQuery = Pick<ArticlesQuery, 'author' | 'favorited' | 'tag'>;

export type FilterInit = {
  key: keyof FilterQuery;
  value: string;
};

export type FilterModel = ReturnType<typeof createFilterModel>;
export type FilterStore = FilterModel['$query'];

export function createFilterModel() {
  const init = createEvent<FilterInit | void>();
  const reset = createEvent();

  const filterChanged = createEvent();

  const $query = createStore<FilterQuery | null>(null)
    .on(init, (defaultQuery, newQuery) =>
      newQuery ? { [newQuery.key]: newQuery.value } : defaultQuery,
    )
    .reset(reset);

  const filterBy = createApi($query, {
    all: () => null,
    tag: (_, tag: string) => ({ tag }),
    author: (_, author: string) => ({ author }),
    authorFavorites: (_, favorited: string) => ({ favorited }),
  });

  const filterEvents = Object.values(filterBy);

  sample({
    clock: filterEvents,
    target: filterChanged,
  });

  return { init, reset, filterBy, filterChanged, $query };
}

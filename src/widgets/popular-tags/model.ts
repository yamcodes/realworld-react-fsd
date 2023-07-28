import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { tagApi } from '~entities/tag';

export type PopularTagsModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const unmounted = createEvent();

  const popularTagsQuery = createQuery({
    handler: tagApi.getTagsFx,
    name: 'popularTagsQuery',
  });

  sample({
    clock: init,
    target: popularTagsQuery.start,
  });

  return { init, unmounted, popularTagsQuery };
}

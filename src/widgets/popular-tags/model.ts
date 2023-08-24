import { attachOperation } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import { tagApi } from '~entities/tag';

export type PopularTagsModel = Omit<ReturnType<typeof createModel>, 'init'>;

export function createModel() {
  const init = createEvent();
  const unmounted = createEvent();
  const tagClicked = createEvent<string>();

  const popularTagsQuery = attachOperation(tagApi.tagsQuery);

  sample({
    clock: init,
    target: popularTagsQuery.reset,
  });

  sample({
    clock: init,
    target: popularTagsQuery.start,
  });

  return { init, unmounted, tagClicked, popularTagsQuery };
}

import { createEvent, sample, Store } from 'effector';
import { Ctx } from '~shared/ctx';

type ConextConfig = {
  $context: Store<Ctx>;
  $store: Store<Ctx>;
};

export function createContext(config: ConextConfig) {
  const { $context, $store } = config;
  const initilize = createEvent();

  sample({
    clock: initilize,
    source: $context,
    target: $store,
  });

  return { initilize };
}

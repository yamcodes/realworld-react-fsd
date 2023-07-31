import { createEvent, attach, sample } from 'effector';
import { $ctx } from '~shared/ctx';

type NavigateModel = {
  path: string;
};

export function createNavigateMobel(config: NavigateModel) {
  const { path } = config;

  const navigate = createEvent();

  const navigateToFx = attach({
    source: $ctx,
    effect: (ctx) => ctx.router.navigate(path),
    name: 'navigateToFx.'.concat(path),
  });

  sample({
    clock: navigate,
    target: navigateToFx,
  });

  return { navigate };
}

import { attach } from 'effector';
import { $ctx } from '~shared/ctx';

function createSessionModel() {
  const updateStorageTokenFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.tokenStorage.updateToken(token),
  });

  return { updateStorageTokenFx };
}

export const { updateStorageTokenFx } = createSessionModel();

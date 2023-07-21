import { Store, attach, sample, createEvent } from 'effector';
import { sessionApi } from '~entities/session';
import { NewUserDto } from '~shared/api/realworld';
import { requestFactory } from '~shared/api/request';
import { $ctx } from '~shared/ctx';

type CreateUserModelConfig = {
  $newUser: Store<NewUserDto>;
};

export type NewUserModel = ReturnType<typeof createNewUserModel>;

export function createNewUserModel(config: CreateUserModelConfig) {
  const { $newUser } = config;

  const updateTokenRestFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.restClient!.setSecurityData(token),
  });

  const updateTokenStorageFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.credentials!.update(token),
  });

  const create = createEvent();
  const cancel = createEvent();

  // const clearTokenStorageFx = attach({
  //   source: $ctx,
  //   effect: (ctx) => ctx.credentials!.clear(),
  // });

  const cancelToken = 'createUserFx';
  const createUserFx = attach({ effect: sessionApi.createUserFx });
  const requestAbortFx = attach({
    source: $ctx,
    effect: (ctx) => {
      ctx.restClient!.abortRequest(cancelToken);
    },
  });

  const $response = requestFactory({ effect: createUserFx });

  sample({
    clock: create,
    source: $newUser,
    fn: (user) => ({ user, params: { cancelToken } }),
    target: createUserFx,
  });

  sample({
    clock: createUserFx.doneData,
    fn: (user) => user.token,
    target: [updateTokenRestFx, updateTokenStorageFx],
  });

  // sample({
  //   clock: createUserFx.failData,
  //   fn: () => null,
  //   target: [updateTokenRestFx, clearTokenStorageFx],
  // });

  sample({
    clock: cancel,
    fn: () => cancelToken,
    target: requestAbortFx,
  });

  // const response = requestFactory({
  //   effect: createUserFx,
  //   reset: [init, initilize],
  //   name: 'createUserFx',
  // });

  return { create, cancel, $response };
}

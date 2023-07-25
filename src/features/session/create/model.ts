import {
  Store,
  attach,
  createEvent,
  createStore,
  combine,
  sample,
} from 'effector';
import { sessionApi, $$sessionModel } from '~entities/session';
import { NewUserDto, UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

export type CreateUserModelConfig = {
  $newUser: Store<NewUserDto>;
};

export type NewUserModel = ReturnType<typeof createNewUserModel>;

export function createNewUserModel(config: CreateUserModelConfig) {
  const { $newUser } = config;

  const $cancelToken = createStore('createUserFx');

  const abort = createEvent();
  const reset = createEvent();

  const createUserFx = attach({
    source: { user: $newUser, cancelToken: $cancelToken },
    effect: async ({ user, cancelToken }) =>
      sessionApi.createUserFx({ user, params: { cancelToken } }),
  });

  const abortUserCreationFx = attach({
    source: { ctx: $ctx, cancelToken: $cancelToken },
    effect: ({ ctx, cancelToken }) => {
      ctx.restClient.abortRequest(cancelToken);
    },
  });

  const $data = createStore<UserDto | null>(null)
    .on(createUserFx.doneData, (_, data) => data)
    .reset(reset);

  const $error = createStore<Error | null>(null)
    .on(createUserFx.failData, (_, error) => error)
    .reset(reset);

  const $response = combine({
    data: $data,
    pending: createUserFx.pending,
    error: $error,
  });

  sample({
    clock: createUserFx.doneData,
    fn: (user) => user.token,
    target: $$sessionModel.updateToken,
  });

  sample({
    clock: abort,
    target: abortUserCreationFx,
  });

  return { createUserFx, abort, reset, $response };
}

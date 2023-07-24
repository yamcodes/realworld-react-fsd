import {
  Store,
  attach,
  createEvent,
  createStore,
  combine,
  sample,
} from 'effector';
import { sessionApi, sessionModel } from '~entities/session';
import { LoginUserDto, UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

export type CreateLoginModelConfig = {
  $loginUser: Store<LoginUserDto>;
};

export type LoginUserModel = ReturnType<typeof createLoginUserModel>;

export function createLoginUserModel(config: CreateLoginModelConfig) {
  const { $loginUser } = config;

  const $cancelToken = createStore('loginUserFx');

  const abort = createEvent();
  const reset = createEvent();

  const updateRestTokenFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.restClient.setSecurityData(token),
  });

  const loginUserFx = attach({
    source: { user: $loginUser, cancelToken: $cancelToken },
    effect: async ({ user, cancelToken }) =>
      sessionApi.loginUserFx({ user, params: { cancelToken } }),
  });

  const abortUserLoginFx = attach({
    source: { ctx: $ctx, cancelToken: $cancelToken },
    effect: ({ ctx, cancelToken }) => {
      ctx.restClient.abortRequest(cancelToken);
    },
  });

  const $data = createStore<UserDto | null>(null)
    .on(loginUserFx.doneData, (_, data) => data)
    .reset(reset);

  const $error = createStore<Error | null>(null)
    .on(loginUserFx.failData, (_, error) => error)
    .reset(reset);

  const $response = combine({
    data: $data,
    pending: loginUserFx.pending,
    error: $error,
  });

  sample({
    clock: loginUserFx.doneData,
    fn: (user) => user.token,
    target: [sessionModel.updateStorageTokenFx, updateRestTokenFx],
  });

  sample({
    clock: abort,
    target: abortUserLoginFx,
  });

  return { loginUserFx, abort, reset, $response };
}

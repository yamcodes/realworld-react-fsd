import {
  Store,
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { ZodSchema, string } from 'zod';
import { sessionApi } from '~entities/session';
import { NewUserDto, UserDto } from '~shared/api/realworld';
import { $ctx } from '~shared/ctx';

export type FieldModel = Omit<
  ReturnType<typeof createFieldModel>,
  'validateFieldFx'
>;

export type FieldConfig<Value> = {
  initialValue: Value;
  validationSchema: ZodSchema<Value>;
};

function createFieldModel<Value>(config: FieldConfig<Value>) {
  const { initialValue, validationSchema } = config;

  const validateFx = createEffect({
    handler: (value: Value) => {
      const result = validationSchema.safeParse(value);
      // eslint-disable-next-line no-underscore-dangle
      if (!result.success) return result.error.format()._errors;
      return null;
    },
  });

  const changed = createEvent<Value>();
  const touched = createEvent();

  const $value = createStore(initialValue).on(changed, (_, value) => value);
  const $touched = createStore(false)
    .on(touched, () => true)
    .on(validateFx, () => true);
  const $error = createStore<string[] | null>(null).on(
    validateFx.doneData,
    (_, error) => error,
  );

  sample({
    clock: [changed, touched],
    source: $value,
    filter: $touched,
    target: validateFx,
  });

  const validateFieldFx = attach({
    source: $value,
    effect: validateFx,
  });

  return {
    $value,
    $error,
    changed,
    touched,
    validateFieldFx,
  };
}

type CreateUserModelConfig = {
  $newUser: Store<NewUserDto>;
};

// type NewUserModel = ReturnType<typeof createNewUserModel>;

export function createNewUserModel(config: CreateUserModelConfig) {
  const { $newUser } = config;

  const updateTokenRestFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.restClient.setSecurityData(token),
  });

  const updateTokenStorageFx = attach({
    source: $ctx,
    effect: (ctx, token: string) => ctx.credentials.update(token),
  });

  const cancelToken = 'createUserFx';
  const createUserFx = attach({ effect: sessionApi.createUserFx });
  const requestAbortFx = attach({
    source: $ctx,
    effect: (ctx) => {
      ctx.restClient.abortRequest(cancelToken);
    },
  });

  const create = createEvent();
  const abort = createEvent();

  const $data = createStore<UserDto | null>(null).on(
    createUserFx.doneData,
    (_, data) => data,
  );

  const $error = createStore<Error | null>(null).on(
    createUserFx.failData,
    (_, error) => error,
  );

  const $response = combine({
    data: $data,
    pending: createUserFx.pending,
    error: $error,
  });

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

  sample({
    clock: abort,
    fn: () => cancelToken,
    target: requestAbortFx,
  });

  return { create, abort, $response };
}

export type RegisterFormModel = ReturnType<typeof createRegisterFormModel>;

export function createRegisterFormModel() {
  const formUnmounted = createEvent();
  const formSubmitted = createEvent();

  const { validateFieldFx: validateUsernameFx, ...$$username } =
    createFieldModel({
      initialValue: '',
      validationSchema: string().min(3),
    });
  const { validateFieldFx: validateEmailFx, ...$$email } = createFieldModel({
    initialValue: '',
    validationSchema: string().min(3),
  });
  const { validateFieldFx: validatePasswordFx, ...$$password } =
    createFieldModel({
      initialValue: '',
      validationSchema: string().min(3),
    });

  const $newUser = combine<NewUserDto>({
    username: $$username.$value,
    email: $$email.$value,
    password: $$password.$value,
  });

  const validateFormFx = createEffect({
    handler: async () => {
      const errors = await Promise.all([
        validateUsernameFx(),
        validateEmailFx(),
        validatePasswordFx(),
      ]);

      return errors.some(Boolean) ? errors : null;
    },
  });

  const $valid = createStore(true).on(
    validateFormFx.doneData,
    (_, errors) => !errors,
  );

  const $$newUser = createNewUserModel({ $newUser });

  sample({
    clock: formSubmitted,
    source: [$$username.$value, $$email.$value, $$password.$value],
    target: validateFormFx,
  });

  sample({
    clock: validateFormFx.doneData,
    filter: $valid,
    target: $$newUser.create,
  });

  sample({
    clock: formUnmounted,
    target: $$newUser.abort,
  });

  return {
    formUnmounted,
    $response: $$newUser.$response,
    $$username,
    $$email,
    $$password,
    $valid,
    formSubmitted,
  };
}

import {
  createEffect,
  createEvent,
  createStore,
  Event,
  sample,
  Store,
} from 'effector';
import { z, ZodError } from 'zod';

type FieldFactoryParams = {
  formSubmitted: Event<void>;
  validationSchema: z.ZodSchema;
};

type ReturnType = [
  Store<string>,
  Store<string[] | null>,
  Store<boolean>,
  Store<boolean>,
  Event<string>,
  Event<void>,
];

export function fieldFactory(params: FieldFactoryParams): ReturnType {
  const { formSubmitted, validationSchema } = params;

  const validateFx = createEffect<string, void, ZodError>({
    name: 'validateFx',
    handler: (value) => {
      validationSchema.parse(value);
    },
  });

  const $field = createStore<string>('');
  const $error = createStore<string[] | null>(null);
  const $touch = createStore(false);
  const $validate = createStore(false);

  const fieldChanged = createEvent<string>();
  const fieldTouched = createEvent();
  // const fieldValidated = createEvent<boolean>();

  $field.on(fieldChanged, (_, value) => value);
  $touch.on(fieldTouched, () => true);

  sample({
    clock: [fieldTouched, formSubmitted],
    source: $field,
    target: [validateFx],
  });

  $validate.on(validateFx.pending, () => true);
  $validate.on(validateFx.finally, () => false);

  $error.on(validateFx.failData, (_, zodError) =>
    zodError.issues.map((issue) => issue.message),
  );

  return [$field, $error, $touch, $validate, fieldChanged, fieldTouched];
}

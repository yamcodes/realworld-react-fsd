import {
  createEffect,
  createEvent,
  createStore,
  sample,
  attach,
} from 'effector';
import { ZodSchema } from 'zod';

export type FieldModel<Value> = ReturnType<typeof createFieldModel<Value>>;

export type FieldConfig<Value> = {
  initialValue: Value;
  validationSchema: ZodSchema<Value>;
};

export function createFieldModel<Value>(config: FieldConfig<Value>) {
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
  const reset = createEvent();

  const $value = createStore(initialValue)
    .on(changed, (_, value) => value)
    .reset(reset);

  const $touched = createStore(false)
    .on(touched, () => true)
    .on(validateFx, () => true)
    .reset(reset);

  const $error = createStore<string[] | null>(null)
    .on(validateFx.doneData, (_, error) => error)
    .reset(reset);

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
    reset,
    validateFieldFx,
  };
}

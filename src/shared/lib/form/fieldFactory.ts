/* eslint-disable no-promise-executor-return */
import {
  createEffect,
  createEvent,
  createStore,
  Event,
  sample,
} from 'effector';
import { every, not, reset } from 'patronum';
import { z, ZodError } from 'zod';

export type FieldConfig<Value> = {
  initialValue: Value;
  validateOn: Array<Event<void>>;
  resetOn: Array<Event<void>>;
  validationSchema: z.ZodSchema<Value>;
  name: string;
};

export type Field<Value> = ReturnType<typeof fieldFactory<Value>>;

export function fieldFactory<Value>(config: FieldConfig<Value>) {
  const { initialValue, validateOn, resetOn, validationSchema, name } = config;

  const validateFx = createEffect<Value, void, ZodError>({
    name: name.concat('.validateFx'),
    handler: async (value) => {
      await validationSchema.parseAsync(value);
      // .then(
      //   (result) => new Promise((res) => setTimeout(res, 2000, result)),
      //   (reject) => new Promise((_, rej) => setTimeout(rej, 2000, reject)),
      // );
    },
  });

  const $value = createStore<Value>(initialValue, {
    name: name.concat('.value'),
  });
  const $errors = createStore<string[] | null>(null, {
    name: name.concat('.errors'),
  });
  const $touched = createStore(false, { name: name.concat('.touched') });
  const $validating = validateFx.pending;
  const $valid = every({
    stores: [not($errors.map(Boolean)), $touched],
    predicate: true,
  });

  const valueChanged = createEvent<Value>(name.concat('.valueChanged'));
  const fieldTouched = createEvent(name.concat('.fieldTouched'));

  $value.on(valueChanged, (_, value) => value);
  $touched.on(fieldTouched, () => true);

  sample({
    clock: [fieldTouched, valueChanged],
    source: $value,
    filter: $touched,
    target: validateFx,
    name: name.concat('.sample.defaultValidation'),
  });

  sample({
    clock: validateOn,
    source: $value,
    target: validateFx,
    name: name.concat('.sample.validateOnValidation'),
  });

  $touched.on(validateFx.pending, () => true);

  $errors.on(validateFx.failData, (_, zodError) =>
    zodError.issues.map((issue) => issue.message),
  );
  $errors.reset(validateFx.doneData);

  reset({
    clock: resetOn,
    target: [$value, $errors, $touched],
  });

  return {
    $value,
    $errors,
    $touched,
    $validating,
    $valid,
    changed: valueChanged,
    touched: fieldTouched,
  };
}

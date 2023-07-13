/* eslint-disable no-promise-executor-return */
import {
  createEffect,
  createEvent,
  createStore,
  Event,
  sample,
} from 'effector';
import { every, not } from 'patronum';
import { z, ZodError } from 'zod';

type FieldFactoryParams<T> = {
  initialValue: T;
  validateOn: Array<Event<void>>;
  validationSchema: z.ZodSchema;
  name: string;
};

export function fieldFactory<T>(params: FieldFactoryParams<T>) {
  const { initialValue, validateOn, validationSchema, name } = params;

  const validateFx = createEffect<T, void, ZodError>({
    name: name.concat('.validateFx'),
    handler: async (value) => {
      await validationSchema.parseAsync(value).then(
        (result) => new Promise((res) => setTimeout(res, 300, result)),
        (reject) => new Promise((_, rej) => setTimeout(rej, 300, reject)),
      );
    },
  });

  const $value = createStore<T>(initialValue, { name: name.concat('.value') });
  const $errors = createStore<string[] | null>(null, {
    name: name.concat('.errors'),
  });
  const $touched = createStore(false, { name: name.concat('.touched') });
  const $validating = validateFx.pending;
  const $valid = every({
    stores: [not($errors.map(Boolean)), $touched],
    predicate: true,
  });

  const valueChanged = createEvent<T>(name.concat('.valueChanged'));
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

  $errors.on(validateFx.failData, (_, zodError) =>
    zodError.issues.map((issue) => issue.message),
  );
  $errors.reset(validateFx.doneData);

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

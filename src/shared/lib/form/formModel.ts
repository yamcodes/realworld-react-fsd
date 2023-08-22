import {
  Store,
  combine,
  createEffect,
  Effect,
  createEvent,
  sample,
  Event,
} from 'effector';
import { FieldModel, FieldConfig, createFieldModel } from './fieldModel';

type AnyFormValues = Record<string, any>;

type FormFieldConfig<Value> = FieldConfig<Value>;
type FormFieldConfigs<Values extends AnyFormValues> = {
  [K in keyof Values]: FormFieldConfig<Values[K]>;
};

type FormConfig<Values extends AnyFormValues> = {
  fields: FormFieldConfigs<Values>;
};

export type FormFieldModel<Value> = Omit<FieldModel<Value>, 'validateFieldFx'>;
type AnyFields = Record<string, FormFieldModel<any>>;
type FormFields<Values extends AnyFormValues> = {
  [K in keyof Values]: FormFieldModel<Values[K]>;
};
type Form<Values extends AnyFormValues> = {
  fields: FormFields<Values>;
  $form: Store<Values>;
  setForm: Event<Partial<AnyFormValues>>;
  validate: Event<void>;
  validated: {
    success: Event<void>;
    failure: Event<void>;
  };
  reset: Event<void>;
};

export function createFormModel<Values extends AnyFormValues>(
  formConfig: FormConfig<Values>,
) {
  const { fields } = formConfig;

  const reset = createEvent();
  const validate = createEvent();
  const success = createEvent();
  const failure = createEvent();
  const setForm = createEvent<Partial<AnyFormValues>>();

  const fieldNames = Object.keys(fields);

  const outputFields: AnyFields = {};
  const resetForm: Array<Event<void>> = [];
  const fieldValidateFxs: Array<Effect<void, string[] | null, Error>> = [];

  fieldNames.forEach((fieldName) => {
    const fieldConfig = fields[fieldName];

    const { validateFieldFx, ...$$field } = createFieldModel(fieldConfig);

    outputFields[fieldName] = $$field;
    resetForm.push($$field.reset);
    fieldValidateFxs.push(validateFieldFx);

    sample({
      clock: setForm,
      filter: (formFields) => Boolean(formFields[fieldName]),
      fn: (formFields) => formFields[fieldName],
      target: $$field.changed,
    });
  });

  const $form = combine(
    fieldNames.reduce(
      (stores, fieldName) => ({
        ...stores,
        [fieldName]: outputFields[fieldName].$value,
      }),
      {} as { [K in keyof Values]: Values[K] },
    ),
  );

  const validateFx = createEffect({
    handler: async () => {
      const errors = await Promise.all(
        fieldValidateFxs.map((validateFieldFx) => validateFieldFx()),
      );

      return errors.some(Boolean) ? errors : null;
    },
  });

  sample({
    clock: validate,
    target: validateFx,
  });

  sample({
    clock: validateFx.doneData,
    filter: (errors) => !errors,
    target: success,
  });

  sample({
    clock: validateFx.doneData,
    filter: (errors) => Boolean(errors),
    target: failure,
  });

  sample({
    clock: reset,
    target: resetForm,
  });

  return {
    fields: outputFields,
    $form,
    validate,
    setForm,
    validated: {
      success,
      failure,
    },
    reset,
  } as Form<Values>;
}

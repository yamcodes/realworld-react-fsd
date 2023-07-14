import { Event, Store, combine } from 'effector';
import { every } from 'patronum';
import { Field, FieldConfig, fieldFactory } from './fieldFactory';

type AnyFormValues = Record<string, any>;

type FormFieldConfig<Value> = Omit<
  FieldConfig<Value>,
  'validateOn' | 'resetOn'
>;
type FormFieldConfigs<Values extends AnyFormValues> = {
  [K in keyof Values]: FormFieldConfig<Values[K]>;
};

type FormConfig<Values extends AnyFormValues> = {
  fields: FormFieldConfigs<Values>;
  validateOn: Array<Event<void>>;
  resetOn: Array<Event<any>>;
  name: string;
};

type AnyFields = Record<string, Field<any>>;
type FormFields<Values extends AnyFormValues> = {
  [K in keyof Values]: Field<Values[K]>;
};
type Form<Values extends AnyFormValues> = {
  fields: FormFields<Values>;
  $form: Store<Values>;
  $validating: Store<boolean>;
  $valid: Store<boolean>;
};

export function formFactory<Values extends AnyFormValues>(
  formConfig: FormConfig<Values>,
) {
  const { fields, validateOn, resetOn, name } = formConfig;

  const fieldNames = Object.keys(fields);
  const outputFields: AnyFields = {};

  fieldNames.forEach((fieldName) => {
    const fieldConfig = fields[fieldName];

    const formFieldName = name.concat('.').concat(fieldConfig.name);

    const field = fieldFactory({
      ...fieldConfig,
      validateOn,
      resetOn,
      name: formFieldName,
    });

    outputFields[fieldName] = field;
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

  const $validating = every({
    stores: fieldNames.reduce(
      (stores, fieldName) => [...stores, outputFields[fieldName].$validating],
      [] as Array<Store<boolean>>,
    ),
    predicate: true,
  });

  const $valid = every({
    stores: fieldNames.reduce(
      (stores, fieldName) => [...stores, outputFields[fieldName].$valid],
      [] as Array<Store<boolean>>,
    ),
    predicate: true,
  });

  return {
    fields: outputFields,
    $form,
    $validating,
    $valid,
  } as Form<Values>;
}

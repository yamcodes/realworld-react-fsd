import { ChangeEvent, FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { FormFieldModel } from '~shared/lib/form';
import { ErrorHandler } from '~shared/ui/error-handler';
import { UserSettingsFormModel } from './model';

type FieldType = {
  $$model: FormFieldModel<string>;
};

function ImageField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="URL of profile picture"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function UsernameField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Your Name"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function BioField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <textarea
        className="form-control form-control-lg"
        rows={8}
        placeholder="Short bio about you"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function EmailField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Email"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function PasswordField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="password"
        placeholder="Password"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

type UserSettingsFormProps = {
  $$model: UserSettingsFormModel;
};

export function UserSettingsForm(props: UserSettingsFormProps) {
  const { $$model } = props;
  const [error, pending] = useUnit([
    $$model.$$sessionUpdate.$error,
    $$model.$$sessionUpdate.$pending,
  ]);
  const [submited, unmounted] = useUnit([$$model.submitted, $$model.unmounted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submited();
  };

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      {error && <ErrorHandler error={error as any} />}
      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <ImageField $$model={$$model.fields.image} />
          <UsernameField $$model={$$model.fields.username} />
          <BioField $$model={$$model.fields.bio} />
          <EmailField $$model={$$model.fields.email} />
          <PasswordField $$model={$$model.fields.password} />
          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
          >
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
}

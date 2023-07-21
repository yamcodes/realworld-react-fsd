import { ChangeEvent, FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { FieldModel, RegisterFormModel } from '../../model/registerFormModel';

type FieldType = {
  $$model: FieldModel;
};

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

type SubmitButtonProps = {
  $$model: RegisterFormModel;
};

function SubmitButton(props: SubmitButtonProps) {
  const { $$model } = props;

  const valid = useUnit($$model.$valid);

  return (
    <button
      type="submit"
      className="btn btn-lg btn-primary pull-xs-right"
      disabled={!valid}
    >
      Sign up
    </button>
  );
}

type RegisterFormProps = {
  $$model: RegisterFormModel;
};

export function RegisterForm(props: RegisterFormProps) {
  const { $$model } = props;
  const { error, pending } = useUnit($$model.$response);
  const [submited, unmounted] = useUnit([
    $$model.formSubmitted,
    $$model.formUnmounted,
  ]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submited();
  };

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      <h1 className="text-xs-center">Sign up</h1>
      <p className="text-xs-center">
        <Link to={PATH_PAGE.login}>Have an account?</Link>
      </p>

      {error && <ErrorHandler error={error as any} />}

      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <UsernameField $$model={$$model.$$username} />
          <EmailField $$model={$$model.$$email} />
          <PasswordField $$model={$$model.$$password} />
          <SubmitButton $$model={$$model} />
        </fieldset>
      </form>
    </>
  );
}

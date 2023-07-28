import { ChangeEvent, FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { FormFieldModel } from '~shared/lib/form';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { SigninFormModel } from './model';

type FieldType = {
  $$model: FormFieldModel<string>;
};

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

type SigninFormProps = {
  $$model: SigninFormModel;
};

export function SigninForm(props: SigninFormProps) {
  const { $$model } = props;

  const [error, pending] = useUnit([
    $$model.$$sessionSignIn.$error,
    $$model.$$sessionSignIn.$pending,
  ]);
  const [submited, unmounted] = useUnit([$$model.submitted, $$model.unmounted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submited();
  };

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      <h1 className="text-xs-center">Sign In</h1>
      <p className="text-xs-center">
        <Link to={PATH_PAGE.register}>Need an account?</Link>
      </p>

      {error && <ErrorHandler error={error as any} />}

      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <EmailField $$model={$$model.fields.email} />
          <PasswordField $$model={$$model.fields.password} />
          <button
            type="submit"
            className="btn btn-lg btn-primary pull-xs-right"
          >
            Sign in
          </button>
        </fieldset>
      </form>
    </>
  );
}

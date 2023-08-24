import { FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Input } from '~shared/ui/input';
import { SigninFormModel } from './model';

type SigninFormProps = {
  $$model: SigninFormModel;
};

export function SigninForm(props: SigninFormProps) {
  const { $$model } = props;

  const pending = useUnit($$model.$$sessionSignIn.$pending);
  const error = useUnit($$model.$error);

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

      {error && <ErrorHandler error={error} />}

      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <Input
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
            $$model={$$model.fields.email}
          />
          <Input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            $$model={$$model.fields.password}
          />
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

import { FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Input } from '~shared/ui/input';
import { SignupFormModel } from './model';

type SignupFormProps = {
  $$model: SignupFormModel;
};

export function SignupForm(props: SignupFormProps) {
  const { $$model } = props;

  const pending = useUnit($$model.$$sessionSignUp.$pending);
  const error = useUnit($$model.$error);

  const [submited, unmounted] = useUnit([$$model.submitted, $$model.unmounted]);

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

      {error && <ErrorHandler error={error} />}

      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <Input
            className="form-control form-control-lg"
            type="text"
            placeholder="Your Name"
            $$model={$$model.fields.username}
          />
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
            Sign up
          </button>
        </fieldset>
      </form>
    </>
  );
}

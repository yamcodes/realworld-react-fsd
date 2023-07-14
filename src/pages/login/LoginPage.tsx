import { ChangeEvent, FormEventHandler } from 'react';
import { useEvent, useStore } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error-handler';
import {
  $error,
  $formValidating,
  $pending,
  emailField,
  formSubmitted,
  passwordField,
} from './model';

function EmailField() {
  const value = useStore(emailField.$value);
  const errors = useStore(emailField.$errors);
  const changed = useEvent(emailField.changed);
  const touched = useEvent(emailField.touched);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  const handleBlur = () => touched();

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors && <p>{errors.join(', ')}</p>}
    </fieldset>
  );
}

function PasswordField() {
  const value = useStore(passwordField.$value);
  const errors = useStore(passwordField.$errors);
  const changed = useEvent(passwordField.changed);
  const touched = useEvent(passwordField.touched);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  const handleBlur = () => touched();

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="password"
        placeholder="Password"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors && <p>{errors.join(', ')}</p>}
    </fieldset>
  );
}
export function LoginPage() {
  const pending = useStore($pending);
  const error = useStore($error);
  const formValidating = useStore($formValidating);
  const submitted = useEvent(formSubmitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submitted();
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to={PATH_PAGE.register}>Need an account?</Link>
            </p>

            {error && <ErrorHandler error={error} />}

            <form onSubmit={onFormSubmit}>
              <fieldset disabled={formValidating || pending}>
                <EmailField />
                <PasswordField />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

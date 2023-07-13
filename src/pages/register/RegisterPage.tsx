import { ChangeEvent, FormEventHandler } from 'react';
import { useEvent, useStore, useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error-handler';
import {
  $error,
  $formValidating,
  $pending,
  $user,
  emailField,
  formSubmitted,
  passwordField,
  usernameField,
} from './model';

function UsernameField() {
  const value = useStore(usernameField.$value);
  const errors = useStore(usernameField.$errors);
  const changed = useEvent(usernameField.changed);
  const touched = useEvent(usernameField.touched);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  const handleBlur = () => touched();

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Your Name"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors && <p>{errors.join(', ')}</p>}
    </fieldset>
  );
}

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

export function RegisterPage() {
  const [user, pending, error] = useUnit([$user, $pending, $error]);
  const formValidating = useStore($formValidating);

  console.log(user);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    formSubmitted();
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to={PATH_PAGE.login}>Have an account?</Link>
            </p>

            {error && <ErrorHandler error={error} />}

            <form onSubmit={onFormSubmit}>
              <fieldset disabled={formValidating || pending}>
                <UsernameField />
                <EmailField />
                <PasswordField />
                <button
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

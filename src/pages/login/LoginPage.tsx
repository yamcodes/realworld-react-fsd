import { ChangeEvent, FormEventHandler } from 'react';
import { useUnit } from 'effector-react';
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
  const [value, errors] = useUnit([emailField.$value, emailField.$errors]);
  const [changed, touched] = useUnit([emailField.changed, emailField.touched]);

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
  const [value, errors] = useUnit([
    passwordField.$value,
    passwordField.$errors,
  ]);
  const [changed, touched] = useUnit([
    passwordField.changed,
    passwordField.touched,
  ]);

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
  const [pending, error, validating] = useUnit([
    $pending,
    $error,
    $formValidating,
  ]);
  const submitted = useUnit(formSubmitted);

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
              <fieldset disabled={validating || pending}>
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

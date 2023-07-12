import { FormEventHandler } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { ErrorHandler } from '~shared/ui/error-handler';
import {
  $error,
  $newUser,
  $pending,
  $user,
  emailChanged,
  formSubmitted,
  usernameChanged,
  passwordChanged,
} from './model';

export function RegisterPage() {
  const { username, email, password } = useUnit($newUser);
  const [user, pending, error] = useUnit([$user, $pending, $error]);

  console.log(`pending: ${pending}`);
  console.log(`user: ${user}`);
  console.log(`error: ${error}`);

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
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  value={username}
                  onChange={(e) => usernameChanged(e.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => emailChanged(e.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => passwordChanged(e.target.value)}
                />
              </fieldset>
              <button
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

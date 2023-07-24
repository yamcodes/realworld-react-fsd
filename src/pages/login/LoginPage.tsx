import { LoginForm } from '~widgets/login-form';
import { $$loginPage } from './model';

export function LoginPage() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <LoginForm $$model={$$loginPage.$$loginForm} />
          </div>
        </div>
      </div>
    </div>
  );
}

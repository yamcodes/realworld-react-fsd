import { RegisterForm } from '~widgets/register-form';
import { $$registerPage } from './model';

export function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <RegisterForm $$model={$$registerPage.$$registerForm} />
          </div>
        </div>
      </div>
    </div>
  );
}

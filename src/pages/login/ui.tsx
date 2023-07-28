import { SigninForm } from '~widgets/sign-in-form';
import { $$loginPage } from './model';

export function LoginPage() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <SigninForm $$model={$$loginPage.$$signinForm} />
          </div>
        </div>
      </div>
    </div>
  );
}

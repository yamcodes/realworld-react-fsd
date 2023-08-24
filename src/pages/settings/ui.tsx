import { useUnit } from 'effector-react';
import { UserSettingsForm } from '~widgets/user-settings-form';
import { $$settingsPage } from './model';

export function SettingsPage() {
  const signout = useUnit($$settingsPage.$$sessionSignout.signout);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <UserSettingsForm $$model={$$settingsPage.$$userSettingsForm} />

            <hr />

            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={signout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

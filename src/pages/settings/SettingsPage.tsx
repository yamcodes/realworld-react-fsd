import { useUnit } from 'effector-react';
import { $$sessionModel } from '~entities/session';
import { UserSettingsForm } from '~widgets/user-settings-form';
import { $$settingsPage } from './model';

export function SettingsPage() {
  const clearSession = useUnit($$sessionModel.clear);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <UserSettingsForm $$model={$$settingsPage.$$settingsForm} />

            <hr />

            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={clearSession}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

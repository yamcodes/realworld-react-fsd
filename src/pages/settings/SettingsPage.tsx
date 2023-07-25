import { UserSettingsForm } from '~widgets/user-settings-form';
import { $$settingsPage } from './model';

export function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <UserSettingsForm $$model={$$settingsPage.$$settingsForm} />

            {/* <hr /> */}

            {/* <LogoutButton /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoSettingsSharp } from 'react-icons/io5';
import { ProfileCard } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { ProfileInfoOwnerModel } from '../../model';

type ProfileInfoOwnerProps = {
  $$model: ProfileInfoOwnerModel;
};

export function ProfileInfoOwner(props: ProfileInfoOwnerProps) {
  const { $$model } = props;

  const profile = useUnit($$model.$profile);

  const navigateToSettings = useUnit($$model.navigateToSettings);
  const unmounted = useUnit($$model.unmounted);

  useEffect(() => unmounted, [unmounted]);

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            {profile && (
              <ProfileCard
                profile={profile}
                actions={
                  <Button
                    color="secondary"
                    variant="outline"
                    className="action-btn"
                    onClick={navigateToSettings}
                  >
                    <IoSettingsSharp size={14} />
                    &nbsp; Edit Profile Settings
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

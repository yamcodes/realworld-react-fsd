import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoSettingsSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ProfileCard } from '~entities/profile';
import { OwnerModel } from '../../model/ownerModel';

type OwnerProps = {
  $$model: OwnerModel;
};

export function Owner(props: OwnerProps) {
  const { $$model } = props;

  const profile = useUnit($$model.$profile);

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
                  <Link
                    to="/settings"
                    className="btn btn-outline-secondary btn-sm action-btn"
                  >
                    <IoSettingsSharp size={14} />
                    &nbsp; Edit Profile Settings
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

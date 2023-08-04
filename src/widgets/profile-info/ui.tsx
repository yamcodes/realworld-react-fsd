import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Profile } from '~entities/profile';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { ProfileInfoModel } from './model/types';

type ProfileInfoProps = {
  $$model: ProfileInfoModel;
  renderProfile: (profile: Profile) => ReactNode;
};

export function ProfileInfo(props: ProfileInfoProps) {
  const { $$model, renderProfile } = props;

  const [profile, pending, error] = useUnit([
    $$model.$profile,
    $$model.$pending,
    $$model.$error,
  ]);

  const unmounted = useUnit($$model.unmounted);

  useEffect(() => unmounted, [unmounted]);

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          {pending && !profile && (
            <ProfileWrapper>
              <Spinner />
            </ProfileWrapper>
          )}

          {(error as any) && (
            <ProfileWrapper>
              <ErrorHandler error={error as any} />
            </ProfileWrapper>
          )}

          <div className="col-xs-12 col-md-10 offset-md-1">
            {profile && renderProfile(profile)}
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfileWrapperProps = {
  children: ReactNode;
};

function ProfileWrapper(props: ProfileWrapperProps) {
  const { children } = props;
  return (
    <div className="col-xs-12 col-md-10 offset-md-1">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '11rem',
        }}
      >
        {children}
      </div>
    </div>
  );
}

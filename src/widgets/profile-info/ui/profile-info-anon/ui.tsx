import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoAdd } from 'react-icons/io5';
import { ProfileCard } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { ProfileInfoAnonModel } from '../../model';

type ProfileInfoAnonProps = {
  $$model: ProfileInfoAnonModel;
};

export function ProfileInfoAnon(props: ProfileInfoAnonProps) {
  const { $$model } = props;

  const [profile, pending, error] = useUnit([
    $$model.$profile,
    $$model.$pending,
    $$model.$error,
  ]);

  const navigateToLogin = useUnit($$model.navigateToLogin);
  const unmounted = useUnit($$model.unmounted);

  useEffect(() => unmounted, [unmounted]);

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          {pending && (
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
            {profile && (
              <ProfileCard
                profile={profile}
                actions={
                  <Button
                    color="secondary"
                    variant="outline"
                    className="action-btn"
                    onClick={navigateToLogin}
                  >
                    <IoAdd size={16} />
                    &nbsp; Follow {profile.username}
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

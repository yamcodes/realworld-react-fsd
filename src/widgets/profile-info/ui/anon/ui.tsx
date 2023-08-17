import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoAdd } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ProfileCard } from '~entities/profile';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { AnonModel } from '../../model/anonModel';

type AnonProps = {
  $$model: AnonModel;
};

export function Anon(props: AnonProps) {
  const { $$model } = props;

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
                  <Link
                    to="/login"
                    className="btn btn-outline-secondary btn-sm action-btn"
                  >
                    <IoAdd size={16} />
                    &nbsp; Follow {profile.username}
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

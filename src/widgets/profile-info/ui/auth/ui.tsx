import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { ProfileCard } from '~entities/profile';
import { FollowProfile, UnfollowProfile } from '~features/profile';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { AuthModel } from '../../model/authModel';

type AuthProps = {
  $$model: AuthModel;
};

export function Auth(props: AuthProps) {
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
          {pending && !profile && (
            <ProfileWrapper>
              <Spinner />
            </ProfileWrapper>
          )}

          {error && (
            <ProfileWrapper>
              <ErrorHandler error={error} />
            </ProfileWrapper>
          )}

          <div className="col-xs-12 col-md-10 offset-md-1">
            {profile && (
              <ProfileCard
                profile={profile}
                actions={
                  profile.following ? (
                    <UnfollowProfile
                      $$model={$$model.$$unfollowProfile}
                      profile={profile}
                    />
                  ) : (
                    <FollowProfile
                      $$model={$$model.$$followProfile}
                      profile={profile}
                    />
                  )
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

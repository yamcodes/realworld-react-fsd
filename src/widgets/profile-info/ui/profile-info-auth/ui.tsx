import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { ProfileCard } from '~entities/profile';
import { FollowProfile, UnfollowProfile } from '~features/profile';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { ProfileInfoAuthModel } from '../../model';

type ProfileInfoAuthProps = {
  $$model: ProfileInfoAuthModel;
};

export function ProfileInfoAuth(props: ProfileInfoAuthProps) {
  const { $$model } = props;

  const { data: profile, pending, error } = useUnit($$model.profileQuery);

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
            {profile && (
              <ProfileCard
                profile={profile}
                actions={
                  profile.following ? (
                    <UnfollowProfile $$model={$$model.$$unfollowProfile} />
                  ) : (
                    <FollowProfile $$model={$$model.$$followProfile} />
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

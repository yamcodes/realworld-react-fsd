import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoAdd } from 'react-icons/io5';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { FollowProfileModel, ProfileCardModel } from './model';

type FollowProfileProps = {
  $$model: FollowProfileModel;
};

function FollowProfile(props: FollowProfileProps) {
  const { $$model } = props;

  const username = useUnit($$model.$username);
  const followed = useUnit($$model.followed);

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={followed}
    >
      <IoAdd size={16} />
      &nbsp; Follow {username}
    </Button>
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

type ProfileCardProps = {
  $$model: ProfileCardModel;
};

export function ProfileCard(props: ProfileCardProps) {
  const { $$model } = props;

  const [profile, { access }] = useUnit([$$model.$profile, $$model.$user]);
  const { error, pending } = useUnit($$model.$response);
  const unmounted = useUnit($$model.unmounted);
  const followButtonClicked = useUnit($$model.followButtonClicked);

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

          {error && (
            <ProfileWrapper>
              <ErrorHandler error={error as any} />
            </ProfileWrapper>
          )}

          {profile && (
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.image}
                className="user-img"
                alt={profile.username}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {access === 'anonymous' && (
                <Button
                  color="secondary"
                  variant="outline"
                  className="action-btn"
                  onClick={followButtonClicked}
                >
                  <IoAdd size={16} />
                  &nbsp; Follow {profile.username}
                </Button>
              )}

              <FollowProfile $$model={$$model.$$followProfile} />

              {/* {access === 'authenticated' &&
                (profile.following ? (
                  <UnfollowUserButton
                    profile={profile}
                    className="action-btn"
                  />
                ) : (
                  <FollowUserButton profile={profile} className="action-btn" />
                ))}

              {access === 'authorized' && (
                <Button
                  color="secondary"
                  variant="outline"
                  className="action-btn"
                  onClick={() => navigate(PATH_PAGE.settings)}
                >
                  <IoSettingsSharp size={14} />
                  &nbsp; Edit Profile Settings
                </Button>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

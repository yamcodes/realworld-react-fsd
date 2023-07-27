import { ReactNode, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { IoAdd, IoRemove, IoSettingsSharp } from 'react-icons/io5';
import { Button } from '~shared/ui/button';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import {
  FollowProfileModel,
  ProfileCardModel,
  UnfollowProfileModel,
} from './model';

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

type UnfollowProfileProps = {
  $$model: UnfollowProfileModel;
};

function UnfollowProfile(props: UnfollowProfileProps) {
  const { $$model } = props;

  const username = useUnit($$model.$username);
  const unfollowed = useUnit($$model.unfollowed);

  return (
    <Button color="secondary" className="action-btn" onClick={unfollowed}>
      <IoRemove size={16} />
      &nbsp; Unfollow {username}
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

  const followButtonClicked = useUnit($$model.followButtonClicked);
  const settingsButtonClicked = useUnit($$model.settingsButtonClicked);
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

              {access === 'authenticated' &&
                (profile.following ? (
                  <UnfollowProfile $$model={$$model.$$unfollowProfile} />
                ) : (
                  <FollowProfile $$model={$$model.$$followProfile} />
                ))}

              {access === 'authorized' && (
                <Button
                  color="secondary"
                  variant="outline"
                  className="action-btn"
                  onClick={settingsButtonClicked}
                >
                  <IoSettingsSharp size={14} />
                  &nbsp; Edit Profile Settings
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

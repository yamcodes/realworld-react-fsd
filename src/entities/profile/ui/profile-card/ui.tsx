import { ReactNode } from 'react';
import { Profile } from '../../types';

type NewType = {
  profile: Profile;
  actions?: ReactNode;
};

type ProfileCardProps = NewType;

export function ProfileCard(props: ProfileCardProps) {
  const { profile, actions } = props;

  const { username, image, bio } = profile;

  return (
    <div className="col-xs-12 col-md-10 offset-md-1">
      <img src={image} className="user-img" alt={username} />
      <h4>{username}</h4>
      <p>{bio}</p>
      {actions}
    </div>
  );
}

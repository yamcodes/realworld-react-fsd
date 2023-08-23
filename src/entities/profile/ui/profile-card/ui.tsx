import { ReactNode } from 'react';
import { Profile } from '../../types';

type ProfileCardProps = {
  profile: Profile;
  actions?: ReactNode;
};

export function ProfileCard(props: ProfileCardProps) {
  const { profile, actions } = props;

  const { username, image, bio } = profile;

  return (
    <>
      <img src={image} className="user-img" alt={username} />
      <h4>{username}</h4>
      <p>{bio}</p>
      {actions}
    </>
  );
}

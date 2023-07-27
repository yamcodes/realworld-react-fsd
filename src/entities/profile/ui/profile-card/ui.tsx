import { ReactNode } from 'react';
import { useUnit } from 'effector-react';
import { ProfileModel } from '../../model';

type NewType = {
  $$model: ProfileModel;
  actions?: ReactNode;
};

type ProfileCardProps = NewType;

export function ProfileCard(props: ProfileCardProps) {
  const { $$model, actions } = props;

  const { username, image, bio } = useUnit($$model.$profile);

  return (
    <div className="col-xs-12 col-md-10 offset-md-1">
      <img src={image} className="user-img" alt={username} />
      <h4>{username}</h4>
      <p>{bio}</p>
      {actions}
    </div>
  );
}

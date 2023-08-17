import { useUnit } from 'effector-react';
import { IoRemove } from 'react-icons/io5';
import { Profile } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { UnfollowProfileModel } from './model';

type UnfollowProfileProps = {
  profile: Profile;
  $$model: UnfollowProfileModel;
};

export function UnfollowProfile(props: UnfollowProfileProps) {
  const { profile, $$model } = props;

  const unfollow = useUnit($$model.unfollow);

  const handleClick = () => unfollow(profile);

  return (
    <Button color="secondary" className="action-btn" onClick={handleClick}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}

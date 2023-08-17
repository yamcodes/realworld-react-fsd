import { useUnit } from 'effector-react';
import { IoAdd } from 'react-icons/io5';
import { Profile } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { FollowProfileModel } from './model';

type FollowProfileProps = {
  profile: Profile;
  $$model: FollowProfileModel;
};

export function FollowProfile(props: FollowProfileProps) {
  const { profile, $$model } = props;

  const follow = useUnit($$model.follow);

  const handleClick = () => follow(profile);

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={handleClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {profile.username}
    </Button>
  );
}
